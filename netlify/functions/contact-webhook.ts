import type { Handler, HandlerEvent } from "@netlify/functions";
import { z } from "zod";

// ── Constants ────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN ?? "";
const DOMAIN = process.env.PIPEDRIVE_DOMAIN ?? "";
const PIPELINE_ID = Number(process.env.PIPEDRIVE_PIPELINE_ID ?? "3");
const STAGE_ID = Number(process.env.PIPEDRIVE_STAGE_ANFRAGE_ID ?? "11");
const BASE_URL = `https://${DOMAIN}.pipedrive.com/api/v1`;

// Deal custom field keys
const DEAL_FIELD_ADRESSE = "39a208a45af41741213be5cf85178e077cd906e0";
const DEAL_FIELD_AUFTRAGSINHALT = "3d669162df7fb03a9affc1a50bfaade5feb80a19";
const DEAL_FIELD_ANLASS = "bdd7ab892a3f9ffcd9b51cedd1d66179aaec93f3";

// Person custom field keys
const PERSON_FIELD_DATENSCHUTZ = "16cec5607e3db7185f0543c48106ed8f73b5ee78";
const PERSON_FIELD_EMPFEHLUNG = "17b3461fc7a670d60c69b1fb3f28cfb79d17af49";

// Option ID mappings
const AUFTRAGSINHALT_MAP: Record<string, number> = {
  "Verkehrswertgutachten": 43,
  "Beleihungswertgutachten": 44,
  "Schadensgutachten": 45,
  "Kurzgutachten / Beratung": 46,
  "Sonstiges": 46,
};

const ANLASS_MAP: Record<string, number> = {
  "Erbschaft / Erbauseinandersetzung": 47,
  "Scheidung / Vermögensauseinandersetzung": 48,
  "Kauf / Verkauf": 49,
  "Finanzierung / Beleihung": 49,
  "Gerichtsverfahren": 51,
  "Steuerliche Bewertung": 52,
  "Sonstiges": 52,
};

// ── Zod schema ───────────────────────────────────────────────────────────────

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  phone: z.string().min(1, "Telefon ist erforderlich"),
  email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  address: z.string().optional(),
  gutachtenart: z.string().optional(),
  anlass: z.string().optional(),
  message: z.string().optional(),
  dsgvo: z.boolean(),
});

type ContactFormPayload = z.infer<typeof ContactFormSchema>;

// ── Pipedrive helpers ────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function pipedriveRequest<T>(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>,
  attempt = 1,
): Promise<T> {
  await sleep(150); // stay well under the 10 req/s limit

  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${path}${sep}api_token=${API_TOKEN}`;

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 429) {
    if (attempt > 3) throw new Error(`Pipedrive rate limit exceeded after 3 retries`);
    await sleep(2000);
    return pipedriveRequest<T>(method, path, body, attempt + 1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`Pipedrive ${method} ${path} → HTTP ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}

// ── Duplicate check ──────────────────────────────────────────────────────────

interface PipedriveSearchResult {
  items: Array<{ item: { id: number } }>;
}

async function findExistingPerson(
  email: string | undefined,
  phone: string,
): Promise<number | null> {
  if (email) {
    const result = await pipedriveRequest<PipedriveSearchResult>(
      "GET",
      `/persons/search?term=${encodeURIComponent(email)}&fields=email&limit=1`,
    );
    if (result?.items?.length > 0) return result.items[0].item.id;
  }

  const result = await pipedriveRequest<PipedriveSearchResult>(
    "GET",
    `/persons/search?term=${encodeURIComponent(phone)}&fields=phone&limit=1`,
  );
  if (result?.items?.length > 0) return result.items[0].item.id;

  return null;
}

// ── Response helpers ─────────────────────────────────────────────────────────

function jsonResponse(statusCode: number, body: Record<string, unknown>) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { success: false, error: "Method not allowed" });
  }

  // Parse JSON body
  let raw: unknown;
  try {
    raw = JSON.parse(event.body ?? "{}");
  } catch {
    return jsonResponse(400, { success: false, error: "Ungültiger JSON-Body" });
  }

  // Validate with Zod
  const parsed = ContactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse(400, { success: false, error: "Name und Telefon sind Pflichtfelder" });
  }

  const data: ContactFormPayload = parsed.data;

  if (!data.dsgvo) {
    return jsonResponse(400, { success: false, error: "Datenschutz-Einwilligung ist erforderlich" });
  }

  try {
    // Step 2: Duplicate check
    const existingId = await findExistingPerson(data.email, data.phone);
    const isDuplicate = existingId !== null;
    let personId: number;

    if (isDuplicate) {
      personId = existingId;
    } else {
      // Step 3: Create person
      const personBody: Record<string, unknown> = {
        name: data.name,
        phone: [{ value: data.phone, primary: true }],
        visible_to: 3,
        [PERSON_FIELD_DATENSCHUTZ]: 73, // Ja
        [PERSON_FIELD_EMPFEHLUNG]: 71,  // Website
      };
      if (data.email) {
        personBody["email"] = [{ value: data.email, primary: true }];
      }

      const person = await pipedriveRequest<{ id: number }>("POST", "/persons", personBody);
      personId = person.id;
    }

    // Step 4 + 5: Build deal title and body
    const dealTitle = data.gutachtenart
      ? `Anfrage ${data.name} / ${data.gutachtenart}`
      : `Anfrage ${data.name}`;

    const dealBody: Record<string, unknown> = {
      title: dealTitle,
      person_id: personId,
      pipeline_id: PIPELINE_ID,
      stage_id: STAGE_ID,
      visible_to: 3,
    };

    if (data.address) {
      dealBody[DEAL_FIELD_ADRESSE] = data.address;
    }
    if (data.gutachtenart && AUFTRAGSINHALT_MAP[data.gutachtenart] !== undefined) {
      dealBody[DEAL_FIELD_AUFTRAGSINHALT] = AUFTRAGSINHALT_MAP[data.gutachtenart];
    }
    if (data.anlass && ANLASS_MAP[data.anlass] !== undefined) {
      dealBody[DEAL_FIELD_ANLASS] = ANLASS_MAP[data.anlass];
    }

    const deal = await pipedriveRequest<{ id: number }>("POST", "/deals", dealBody);

    // Step 5b: Backoffice activity
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const activityNote = [
      "Neue Anfrage über das Kontaktformular.",
      "",
      `Gutachtenart: ${data.gutachtenart || "–"}`,
      `Anlass: ${data.anlass || "–"}`,
      `Objektadresse: ${data.address || "–"}`,
      "",
      "Bitte Kontakt aufnehmen und Anliegen qualifizieren.",
    ].join("\n");

    await pipedriveRequest("POST", "/activities", {
      subject: `Lead kontaktieren: ${data.name}`,
      type: "task",
      deal_id: deal.id,
      person_id: personId,
      user_id: 25671674,
      due_date: today,
      due_time: "",
      note: activityNote,
      done: 0,
    });

    // Step 6: Note (only when message is present)
    if (data.message?.trim()) {
      await pipedriveRequest("POST", "/notes", {
        deal_id: deal.id,
        content: `Nachricht vom Kontaktformular:\n\n${data.message.trim()}`,
        pinned_to_deal_flag: 1,
      });
    }

    // Step 7: Success
    return jsonResponse(200, {
      success: true,
      message: "Anfrage erfolgreich erfasst",
      deal_id: deal.id,
      person_id: personId,
      is_duplicate: isDuplicate,
    });
  } catch (err) {
    console.error("[contact-webhook] Pipedrive error:", err);

    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("rate limit")) {
      return jsonResponse(503, { success: false, error: "CRM vorübergehend nicht erreichbar, bitte erneut versuchen" });
    }
    return jsonResponse(502, { success: false, error: "CRM-Verbindung fehlgeschlagen" });
  }
};
