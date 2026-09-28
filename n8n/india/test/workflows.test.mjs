import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAll } from "../build.mjs";

const all = buildAll();

test("every connection points at a real node", () => {
  for (const wf of Object.values(all)) {
    const names = new Set(wf.nodes.map((n) => n.name));
    assert.equal(names.size, wf.nodes.length, `${wf.name}: duplicate node names`);
    for (const [from, types] of Object.entries(wf.connections)) {
      assert.ok(names.has(from), `${wf.name}: unknown source ${from}`);
      for (const outputs of Object.values(types))
        for (const out of outputs)
          for (const c of out) assert.ok(names.has(c.node), `${wf.name}: unknown target ${c.node}`);
    }
  }
});

test("every Code node compiles", () => {
  for (const wf of Object.values(all)) {
    for (const n of wf.nodes.filter((n) => n.type === "n8n-nodes-base.code")) {
      assert.doesNotThrow(
        () =>
          new Function(
            "$",
            "$input",
            "$execution",
            `return (async () => { ${n.parameters.jsCode}\n })();`,
          ),
        `${wf.name} / ${n.name}`,
      );
    }
  }
});

test("every agent has a Gemini model and a structured output parser", () => {
  for (const wf of Object.values(all)) {
    for (const a of wf.nodes.filter((n) => n.type === "@n8n/n8n-nodes-langchain.agent")) {
      const into = (type) =>
        Object.entries(wf.connections).filter(([, t]) =>
          (t[type] || []).flat().some((c) => c.node === a.name),
        );
      assert.equal(into("ai_languageModel").length, 1, `${a.name} model`);
      assert.equal(into("ai_outputParser").length, 1, `${a.name} parser`);
      assert.equal(a.onError, "continueErrorOutput");
      assert.ok(a.parameters.options.systemMessage.length > 500, `${a.name} prompt`);
    }
  }
});

test("no secrets in the built workflows", () => {
  const json = JSON.stringify(all);
  assert.doesNotMatch(json, /AIza[0-9A-Za-z_-]{20,}|eyJ[0-9A-Za-z_-]{10,}\./);
  assert.match(json, /__GEMINI_CRED_ID__/);
  assert.match(json, /__SUPABASE_CRED_ID__/);
});
