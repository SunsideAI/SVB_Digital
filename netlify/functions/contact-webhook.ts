import type { Handler, HandlerEvent } from "@netlify/functions";
import { z } from "zod";
import { dealField, dealOptionId, personField, personOptionId, stageId } from "./lib/pipedrive-fields";

// ── CORS ─────────────────────────────────────────────────────────────────────

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// ── Pipedrive HTTP helper ─────────────────────────────────────────────────────

const DOMAIN = process.env.PIPEDRIVE_DOMAIN ?? "demo-sunsideai";
const TOKEN  = process.env.PIPEDRIVE_API_TOKEN ?? "";
const BASE   = `https://${DOMAIN}.pipedrive.com/api/v1`;

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function pd<T = unknown>(
  method: "GET" | "POST",
  endpoint: string,
  body?: Record<string, unknown>,
  attempt = 1,
): Promise<T> {
  await sleep(150);
  const sep = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE}${endpoint}${sep}api_token=${TOKEN}`;
  const res  = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (res.status === 429 && attempt <= 3) {
    await sleep(2000);
    return pd<T>(method, endpoint, body, attempt + 1);
  }
  if (!res.ok) throw new Error(`Pipedrive ${method} ${endpoint} → HTTP ${res.status}: ${text}`);
  return JSON.parse(text) as T;
}

// ── Zod schema ────────────────────────────────────────────────────────────────

const Schema = z.object({
  name:              z.string().min(1),
  phone:             z.string().min(1),
  email:             z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  address:           z.string().optional(),
  auftragsinhalt:    z.string().optional(),
  anlass:            z.string().optional(),
  empfehlungsquelle: z.string().optional(),
  freitext:          z.string().optional(),
  datenschutz:       z.boolean(),
});

type Payload = z.infer<typeof Schema>;

// ── Business logic ────────────────────────────────────────────────────────────

interface SearchResponse {
  data: { items: Array<{ item: { id: number } }> } | null;
}

async function findOrCreatePerson(payload: Payload): Promise<{ id: number; isDuplicate: boolean }> {
  // Search by email first, then phone
  for (const [term, field] of [
    [payload.email, "email"],
    [payload.phone, "phone"],
  ] as const) {
    if (!term) continue;
    const res = await pd<SearchResponse>(
      "GET",
      `/persons/search?term=${encodeURIComponent(term)}&fields=${field}&exact_match=true&limit=1`,
    );
    const hit = res.data?.items?.[0]?.item;
    if (hit) {
      console.log(`[contact-webhook] Duplicate found: person_id=${hit.id}`);
      return { id: hit.id, isDuplicate: true };
    }
  }

  // Build person body — custom fields only when field exists in state
  const personBody: Record<string, unknown> = {
    name:  payload.name,
    phone: [{ value: payload.phone, primary: true, label: "work" }],
  };
  if (payload.email) {
    personBody["email"] = [{ value: payload.email, primary: true, label: "work" }];
  }
  try {
    personBody[personField("Datenschutz-Einwilligung").key] =
      personOptionId("Datenschutz-Einwilligung", payload.datenschutz ? "Ja" : "Nein");
  } catch (e) { console.warn("[contact-webhook] Datenschutz field:", (e as Error).message); }

  try {
    const source = payload.empfehlungsquelle ?? "Website";
    personBody[personField("Empfehlungsquelle").key] =
      personOptionId("Empfehlungsquelle", source);
  } catch (e) { console.warn("[contact-webhook] Empfehlungsquelle field:", (e as Error).message); }

  const created = await pd<{ data: { id: number } }>("POST", "/persons", personBody);
  console.log(`[contact-webhook] Person created: id=${created.data.id}`);
  return { id: created.data.id, isDuplicate: false };
}

function extractCity(address: string): string | null {
  const m = address.match(/\d{5}\s+([^\s,]+)/);
  return m?.[1] ?? null;
}

async function createDeal(personId: number, payload: Payload): Promise<number> {
  const city  = payload.address ? extractCity(payload.address) : null;
  const parts = [payload.auftragsinhalt, city ?? "Anfrage", payload.anlass].filter(Boolean);
  const title = parts.length > 1
    ? `${payload.auftragsinhalt ?? "Anfrage"} ${city || ""} – ${payload.anlass ?? ""}`.trim()
    : `Anfrage ${payload.name}`;

  const dealBody: Record<string, unknown> = {
    title,
    stage_id:  stageId("Anfrage eingegangen"),
    person_id: personId,
    currency:  "EUR",
  };

  if (payload.address) {
    try { dealBody[dealField("Projektadresse").key] = payload.address; }
    catch (e) { console.warn("[contact-webhook] Projektadresse field:", (e as Error).message); }
  }
  if (payload.auftragsinhalt) {
    try { dealBody[dealField("Auftragsinhalt").key] = dealOptionId("Auftragsinhalt", payload.auftragsinhalt); }
    catch (e) { console.warn("[contact-webhook] Auftragsinhalt field:", (e as Error).message); }
  }
  if (payload.anlass) {
    try { dealBody[dealField("Anlass").key] = dealOptionId("Anlass", payload.anlass); }
    catch (e) { console.warn("[contact-webhook] Anlass field:", (e as Error).message); }
  }

  const created = await pd<{ data: { id: number } }>("POST", "/deals", dealBody);
  console.log(`[contact-webhook] Deal created: id=${created.data.id}`);
  return created.data.id;
}

async function addNoteAndActivity(dealId: number, personId: number, payload: Payload): Promise<void> {
  // Note with freitext
  if (payload.freitext?.trim()) {
    await pd("POST", "/notes", {
      content:  `<b>Anfrage über Kontaktformular</b><br><br>${payload.freitext.trim()}`,
      deal_id:  dealId,
    });
  }

  // Backoffice activity: task for today assigned to Niklas
  const today = new Date().toISOString().slice(0, 10);
  const noteLines = [
    "Neue Anfrage über das Kontaktformular.",
    "",
    `Gutachtenart: ${payload.auftragsinhalt || "–"}`,
    `Anlass: ${payload.anlass || "–"}`,
    `Objektadresse: ${payload.address || "–"}`,
    "",
    "Bitte Kontakt aufnehmen und Anliegen qualifizieren.",
  ];
  await pd("POST", "/activities", {
    subject:   `Lead kontaktieren: ${payload.name}`,
    type:      "task",
    deal_id:   dealId,
    person_id: personId,
    user_id:   25671674,
    due_date:  today,
    due_time:  "",
    note:      noteLines.join("\n"),
    done:      0,
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────

function json(statusCode: number, body: Record<string, unknown>) {
  return { statusCode, headers: CORS, body: JSON.stringify(body) };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")    return json(405, { success: false, error: "Method not allowed" });

  let raw: unknown;
  try { raw = JSON.parse(event.body ?? "{}"); }
  catch { return json(400, { success: false, error: "Ungültiger JSON-Body" }); }

  const parsed = Schema.safeParse(raw);
  if (!parsed.success) return json(400, { success: false, error: "Name und Telefon sind Pflichtfelder" });
  if (!parsed.data.datenschutz) return json(400, { success: false, error: "Datenschutz-Einwilligung ist erforderlich" });

  const payload = parsed.data;

  try {
    const { id: personId, isDuplicate } = await findOrCreatePerson(payload);
    const dealId = await createDeal(personId, payload);
    await addNoteAndActivity(dealId, personId, payload);

    return json(200, {
      success:      true,
      message:      "Anfrage erfolgreich erfasst",
      deal_id:      dealId,
      person_id:    personId,
      is_duplicate: isDuplicate,
    });
  } catch (err) {
    console.error("[contact-webhook] Error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("rate limit")) return json(503, { success: false, error: "CRM vorübergehend nicht erreichbar" });
    return json(502, { success: false, error: "CRM-Verbindung fehlgeschlagen", detail: msg });
  }
};
