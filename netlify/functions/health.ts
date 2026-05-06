import type { Handler } from "@netlify/functions";
import { loadState } from "./lib/pipedrive-fields";

export const handler: Handler = async () => {
  try {
    const state = loadState();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok:               true,
        state_generated:  state.timestamp,
        domain:           state.domain,
        deal_pipelines:   state.deal_pipelines.length,
        deal_fields:      state.deal_fields.custom.length,
        person_fields:    state.person_fields.custom.length,
        stages:           state.deal_pipelines.flatMap(p =>
          p.stages.map(s => `[${s.id}] ${s.name} (Pipeline: ${p.name})`)
        ),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: (err as Error).message }),
    };
  }
};
