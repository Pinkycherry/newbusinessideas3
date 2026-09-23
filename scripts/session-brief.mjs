#!/usr/bin/env node
/**
 * Session brief: what is true RIGHT NOW, measured, not remembered.
 *
 * Two Claude accounts work this repo in turns. Neither remembers the other,
 * and the docs hold snapshots that go stale. This script is the bridge: it
 * reads the git history on main, what Cloudflare actually has deployed, the
 * live site and the live database, and prints one short report.
 *
 * It runs automatically at the start of every Claude Code session
 * (.claude/settings.json → SessionStart hook). Anywhere else, run it first:
 *
 *   node scripts/session-brief.mjs
 *
 * Read-only. No dependencies. Every network step has a timeout, and a step
 * that cannot run says so and moves on, so the brief never blocks a session.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://bbusiness.online";
const TIMEOUT_MS = 8000;
const lines = [];
const out = (s = "") => lines.push(s);

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"], timeout: 20000 })
      .toString()
      .trim();
  } catch {
    return null;
  }
};

async function get(url, opts = {}) {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), ...opts });
  } catch (e) {
    return { ok: false, status: `unreachable (${e?.cause?.code || e?.name || "error"})` };
  }
}

function readEnv() {
  const env = { ...process.env };
  const file = join(ROOT, ".env");
  if (existsSync(file)) {
    for (const l of readFileSync(file, "utf8").split("\n")) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  }
  return env;
}

// ── 1. Git: what happened on main ─────────────────────────────────────────
out("# BBI SESSION BRIEF (measured live, " + new Date().toISOString().slice(0, 16) + "Z)");
out("Truth order: live site + live DB > git log on main > docs > memory/chat.");
out("Do not ask the founder what happened recently. It is below.");
out();

const fetched = sh("git fetch --quiet origin main && echo ok");
const branch = sh("git rev-parse --abbrev-ref HEAD");
const head = sh("git rev-parse --short origin/main") || sh("git rev-parse --short HEAD");
out("## Git");
if (!fetched) out("! could not fetch origin — the commits below may be behind GitHub");
if (branch && branch !== "main")
  out(`! You are on branch '${branch}'. Work goes to main (it is what deploys).`);
const behind = sh("git rev-list --count HEAD..origin/main");
if (behind && behind !== "0")
  out(`! Local checkout is ${behind} commits behind origin/main — pull first.`);
const dirty = sh("git status --porcelain");
if (dirty) out(`! Uncommitted changes in this checkout (${dirty.split("\n").length} files).`);
out(`main is at ${head}. Last 48 hours on main (newest first):`);
const fmt = (s) =>
  (s || "")
    .split("\n")
    .filter(Boolean)
    .map((l) => "  " + l)
    .join("\n");
const log = sh(`git log origin/main --since="48 hours ago" -25 --format="%h  %ar  %an  %s"`);
out(log ? fmt(log) : "  (no commits in the last 48 hours) — the last five:");
if (!log) out(fmt(sh(`git log origin/main -5 --format="%h  %ar  %an  %s"`)));
// Other branches only matter if someone pushed to one recently and it holds
// work main does not have: that work never reaches the live site.
sh("git fetch --quiet origin");
const weekAgo = Date.now() / 1000 - 7 * 86400;
const stray = (
  sh(`git for-each-ref --format="%(refname:short) %(committerdate:unix)" refs/remotes/origin`) || ""
)
  .split("\n")
  .map((l) => l.split(" "))
  .filter(([ref, t]) => ref && !/^origin(\/(main|HEAD))?$/.test(ref) && Number(t) > weekAgo)
  .map(([ref]) => ref)
  .filter((ref) => (sh(`git rev-list --count origin/main..${ref}`) || "0") !== "0");
if (stray.length)
  out(`! Branches with commits NOT on main, pushed in the last week: ${stray.join(", ")}`);
out();

// ── 2. Cloudflare: what is actually deployed ─────────────────────────────
out("## Deployed on Cloudflare");
const v = await get(`${SITE}/version.json`, { cache: "no-store" });
if (v.ok) {
  try {
    const j = await v.json();
    const live = (j.commit || "").slice(0, 7);
    const mainFull = sh("git rev-parse origin/main") || "";
    if (!live || j.commit === "unknown")
      out("? /version.json has no commit (built outside Workers Builds?)");
    else if (mainFull.startsWith(live)) out(`LIVE = main (${live}), built ${j.builtAt}`);
    else {
      const n = sh(`git rev-list --count ${live}..origin/main`);
      out(
        `! LIVE is ${live} (built ${j.builtAt}); main is ${head}. ${n ?? "?"} commit(s) on main not live yet — a build is running or FAILED. Check Cloudflare → Workers → pinkycherry-newbusinessideas3 → Deployments.`,
      );
    }
  } catch {
    out("? /version.json did not return JSON");
  }
} else
  out(`? /version.json: ${v.status} (deploy stamp not live yet, or site unreachable from here)`);
out();

// ── 3. Live site health ──────────────────────────────────────────────────
out("## Live site");
const home = await get(`${SITE}/`, { cache: "no-store" });
if (home.ok) {
  const html = await home.text();
  const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const robots =
    html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || "index (no robots meta)";
  out(`home ${home.status} · canonical ${canon} · robots ${robots}`);
} else out(`home: ${home.status}`);
const redir = async (u) => {
  const r = await get(u, { redirect: "manual" });
  const to = r.headers?.get?.("location");
  return `${u} → ${r.status}${to ? " " + to : ""}`;
};
out(await redir("http://bbusiness.online/"));
out(await redir("https://www.bbusiness.online/"));
const sm = await get(`${SITE}/sitemap-ideas/1`);
if (sm.ok) out(`sitemap-ideas/1: ${((await sm.text()).match(/<loc>/g) || []).length} idea URLs`);
out();

// ── 4. Live database (public read-only key, same one the site ships) ─────
out("## Live database (ideas table)");
const env = readEnv();
const DB = env.VITE_IDEAVAULT_DB_URL || env.IDEAVAULT_DB_URL;
const KEY = env.VITE_IDEAVAULT_DB_ANON_KEY || env.IDEAVAULT_DB_ANON_KEY;
async function count(filter) {
  const r = await get(`${DB}/rest/v1/ideas?select=slug${filter ? "&" + filter : ""}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: "count=exact", Range: "0-0" },
  });
  return r.headers?.get?.("content-range")?.split("/")[1] ?? `? (${r.status})`;
}
if (DB && KEY) {
  const [total, done, noFacts, metaTpl] = await Promise.all([
    count(""),
    count("status=eq.completed"),
    count("or=(research_facts.is.null,research_facts.eq.%22%5C%22%5C%22%22)"),
    count("meta_description=like.*Honest%20steps,%20the%20real%20work%20involved*"),
  ]);
  out(`ideas ${total} · completed (visible) ${done}`);
  out(`research_facts empty: ${noFacts} (founder is filling these — do not touch)`);
  out(
    `meta_description using the "Honest steps, the real work involved…" template: ${metaTpl} (each one is still unique)`,
  );
} else out("? no DB URL/key in env or .env — skipped");
out();

// ── 5. Work done OUTSIDE the repo (Cloudflare, DNS, Supabase, n8n, GSC) ───
out("## OPS_LOG.md (latest out-of-repo changes)");
const ops = join(ROOT, "OPS_LOG.md");
if (existsSync(ops)) {
  const entries = readFileSync(ops, "utf8")
    .split("\n")
    .filter((l) => /^- \d{4}-\d{2}-\d{2}/.test(l))
    .slice(0, 8);
  out(entries.length ? entries.join("\n") : "(empty)");
} else out("(missing)");
out();

// ── 6. Open work ─────────────────────────────────────────────────────────
out("## PENDING.md");
const pend = join(ROOT, "PENDING.md");
if (existsSync(pend)) {
  let sec = null;
  const tally = {};
  for (const l of readFileSync(pend, "utf8").split("\n")) {
    const h = l.match(/^## (P\d|Decisions)/);
    if (h) sec = h[1];
    else if (sec && /^\| \d+ \|/.test(l)) tally[sec] = (tally[sec] || 0) + 1;
  }
  out(
    Object.entries(tally)
      .map(([k, n]) => `${k}: ${n}`)
      .join(" · ") +
      "  — counts inside PENDING are dated snapshots; quote the LIVE numbers above instead.",
  );
}

console.log(lines.join("\n"));
