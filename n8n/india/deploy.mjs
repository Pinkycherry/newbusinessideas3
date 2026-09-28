// Deploys the India Idea Atlas workflows to n8n through its public API.
// Nobody has to open n8n: credentials, workflows, the error-workflow link
// and activation are all done here. Safe to re-run: workflows are matched by
// name and updated in place, never duplicated.
//
//   N8N_URL=https://<you>.app.n8n.cloud \
//   N8N_API_KEY=...            (n8n > Settings > n8n API > Create an API key)
//   GEMINI_API_KEY=...         (or GEMINI_CRED_ID=<existing n8n credential id>)
//   SUPABASE_SERVICE_ROLE_KEY=...  (or SUPABASE_CRED_ID=<existing credential id>)
//   node n8n/india/deploy.mjs
//
// Optional: GEMINI_MODEL, MAX_REQUESTS_PER_DAY, MAX_INPUT_TOKENS_PER_DAY,
// RECORDS_PER_CALL, PILOT_ONLY=false, SUPABASE_URL, DRY_RUN=1 (print only).
// Keys are read from the environment only and never written to disk.
import { buildAll, DEFAULTS } from "./build.mjs";

const env = process.env;
const DRY = env.DRY_RUN === "1";
const base = (env.N8N_URL || "").replace(/\/+$/, "");
if (!DRY && (!base || !env.N8N_API_KEY)) {
  console.error("Set N8N_URL and N8N_API_KEY (or DRY_RUN=1).");
  process.exit(1);
}

async function api(method, path, body) {
  const res = await fetch(`${base}/api/v1${path}`, {
    method,
    headers: {
      "X-N8N-API-KEY": env.N8N_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

const num = (v, d) => (v === undefined || v === "" ? d : Number(v));
const config = {
  ...DEFAULTS,
  SUPABASE_URL: env.SUPABASE_URL || DEFAULTS.SUPABASE_URL,
  GEMINI_MODEL: env.GEMINI_MODEL || DEFAULTS.GEMINI_MODEL,
  MAX_REQUESTS_PER_DAY: num(env.MAX_REQUESTS_PER_DAY, DEFAULTS.MAX_REQUESTS_PER_DAY),
  MAX_INPUT_TOKENS_PER_DAY: num(env.MAX_INPUT_TOKENS_PER_DAY, DEFAULTS.MAX_INPUT_TOKENS_PER_DAY),
  MAX_OUTPUT_TOKENS: num(env.MAX_OUTPUT_TOKENS, DEFAULTS.MAX_OUTPUT_TOKENS),
  RECORDS_PER_CALL: num(env.RECORDS_PER_CALL, DEFAULTS.RECORDS_PER_CALL),
  PILOT_ONLY: env.PILOT_ONLY ? env.PILOT_ONLY !== "false" : DEFAULTS.PILOT_ONLY,
};

async function credential(idVar, keyVar, name, type, data) {
  if (env[idVar]) return { id: env[idVar], name };
  if (!env[keyVar]) {
    if (DRY) return { id: `__${idVar}__`, name };
    throw new Error(`Set ${keyVar} (or ${idVar} for an existing n8n credential).`);
  }
  if (DRY) return { id: "dry-run", name };
  const created = await api("POST", "/credentials", { name, type, data: data(env[keyVar]) });
  console.log(`credential created: ${name} (${created.id})`);
  return { id: created.id, name };
}

function prepare(wf, gem, supa, errorWorkflowId) {
  const json = JSON.stringify(wf)
    .replaceAll("__GEMINI_CRED_ID__", gem.id)
    .replaceAll("BBI India Gemini", gem.name)
    .replaceAll("__SUPABASE_CRED_ID__", supa.id)
    .replaceAll("BBI India Supabase", supa.name);
  const out = JSON.parse(json);
  for (const n of out.nodes) {
    if (n.name === "Config") {
      n.parameters.jsCode = `// Settings for the India Idea Atlas workflows. Written by deploy.mjs.\nreturn [{ json: ${JSON.stringify(config, null, 2)} }];`;
    }
    if (n.type === "@n8n/n8n-nodes-langchain.lmChatGoogleGemini") {
      n.parameters.modelName = `models/${config.GEMINI_MODEL}`;
      n.parameters.options.maxOutputTokens = config.MAX_OUTPUT_TOKENS;
    }
  }
  if (errorWorkflowId) out.settings.errorWorkflow = errorWorkflowId;
  return { name: out.name, nodes: out.nodes, connections: out.connections, settings: out.settings };
}

async function upsert(existing, body) {
  const found = existing.find((w) => w.name === body.name);
  if (DRY) {
    console.log(
      `[dry-run] ${found ? "update" : "create"} ${body.name}: ${body.nodes.length} nodes`,
    );
    return { id: `dry-${body.name}` };
  }
  if (found) {
    if (found.active) await api("POST", `/workflows/${found.id}/deactivate`);
    const updated = await api("PUT", `/workflows/${found.id}`, body);
    console.log(`updated: ${body.name} (${updated.id})`);
    return updated;
  }
  const created = await api("POST", "/workflows", body);
  console.log(`created: ${body.name} (${created.id})`);
  return created;
}

const gem = await credential(
  "GEMINI_CRED_ID",
  "GEMINI_API_KEY",
  "BBI India Gemini",
  "googlePalmApi",
  (k) => ({
    host: "https://generativelanguage.googleapis.com",
    apiKey: k,
  }),
);
const supa = await credential(
  "SUPABASE_CRED_ID",
  "SUPABASE_SERVICE_ROLE_KEY",
  "BBI India Supabase",
  "supabaseApi",
  (k) => ({
    host: config.SUPABASE_URL,
    serviceRole: k,
  }),
);

const existing = DRY ? [] : (await api("GET", "/workflows?limit=250")).data || [];
const wfs = buildAll();

const errorWf = await upsert(existing, prepare(wfs.errors, gem, supa, null));
const deployed = [];
for (const key of ["planner", "worker", "publisher"]) {
  deployed.push(await upsert(existing, prepare(wfs[key], gem, supa, errorWf.id)));
}
for (const wf of deployed) {
  if (DRY) continue;
  await api("POST", `/workflows/${wf.id}/activate`);
  console.log(`active: ${wf.name}`);
}
console.log(
  DRY
    ? "Dry run complete."
    : "Deployed. The planner runs within the hour, the worker every 2 minutes, the publisher every 20 minutes.",
);
