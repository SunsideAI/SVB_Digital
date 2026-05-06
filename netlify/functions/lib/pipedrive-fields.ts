import fs from "fs";
import path from "path";

interface FieldOption {
  id: number;
  label: string;
}

interface CustomField {
  name: string;
  key: string;
  field_type: string;
  options: FieldOption[] | null;
}

interface PipelineStage {
  id: number;
  name: string;
}

interface Pipeline {
  id: number;
  name: string;
  stages: PipelineStage[];
}

interface SandboxState {
  timestamp: string | null;
  domain: string;
  deal_pipelines: Pipeline[];
  deal_fields: { custom: CustomField[] };
  person_fields: { custom: CustomField[] };
}

let _state: SandboxState | null = null;

export function loadState(): SandboxState {
  if (_state) return _state;
  const file = path.join(__dirname, "../../../data/hsb-sandbox-state.json");
  const raw = fs.readFileSync(file, "utf8");
  const parsed = JSON.parse(raw) as SandboxState;
  if (!parsed.timestamp) {
    throw new Error(
      "State-Datei nicht initialisiert. Bitte ausführen: node scripts/check-hsb-sandbox-v3.js"
    );
  }
  _state = parsed;
  return _state;
}

export function dealField(name: string): CustomField {
  const s = loadState();
  const f = s.deal_fields.custom.find(f => f.name === name);
  if (!f) throw new Error(`Deal-Field "${name}" nicht in State gefunden`);
  return f;
}

export function personField(name: string): CustomField {
  const s = loadState();
  const f = s.person_fields.custom.find(f => f.name === name);
  if (!f) throw new Error(`Person-Field "${name}" nicht in State gefunden`);
  return f;
}

export function dealOptionId(fieldName: string, optionLabel: string): number {
  const f = dealField(fieldName);
  const opt = f.options?.find(o => o.label === optionLabel);
  if (!opt) {
    const available = f.options?.map(o => o.label).join(", ") ?? "keine";
    throw new Error(
      `Option "${optionLabel}" in Deal-Field "${fieldName}" nicht gefunden. Verfügbar: ${available}`
    );
  }
  return opt.id;
}

export function personOptionId(fieldName: string, optionLabel: string): number {
  const f = personField(fieldName);
  const opt = f.options?.find(o => o.label === optionLabel);
  if (!opt) {
    const available = f.options?.map(o => o.label).join(", ") ?? "keine";
    throw new Error(
      `Option "${optionLabel}" in Person-Field "${fieldName}" nicht gefunden. Verfügbar: ${available}`
    );
  }
  return opt.id;
}

export function stageId(stageName: string): number {
  const s = loadState();
  for (const pl of s.deal_pipelines) {
    const st = pl.stages.find(x => x.name === stageName);
    if (st) return st.id;
  }
  throw new Error(`Stage "${stageName}" nicht gefunden`);
}
