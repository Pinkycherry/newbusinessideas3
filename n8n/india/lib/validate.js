// India Idea Atlas: deterministic validation of one generation round.
//
// Runs inside the Worker's "Validate & dedupe" Code node (inlined as text by
// build.mjs) and in n8n/india/test/validate.test.mjs. Pure functions, no I/O.
// The model's structured output only guarantees SHAPE; everything that makes
// an idea publishable is decided here and again by the database constraints.
//
// Plain script (no import/export) so it can be pasted into a Code node.

const WORK_MODES = ["home", "local", "online", "hybrid"];
const PROSE_FIELDS = [
  "customer",
  "problem",
  "offer",
  "customer_reach",
  "revenue_model",
  "first_test",
  "main_risk",
];

// Zero fabricated numbers: no digits anywhere in model prose, and no money or
// scale words that smuggle a figure in as text.
const NUMBER_PATTERN =
  /[0-9₹%$]|\b(lakh|lakhs|crore|crores|thousand|million|billion|per ?cent|percent)\b/i;
// Claims a proposal cannot make.
const OVERCLAIM_PATTERN =
  /\b(guarantee[ds]?|proven|validated|risk[- ]free|assured income|passive income forever|get rich|best in india|number one|#1|market size|cagr|demand score)\b/i;
// Real-money gaming is out of scope entirely.
const WAGER_PATTERN =
  /\b(bet|bets|betting|wager|wagering|gambl\w*|casino|satta|real[- ]money|fantasy (league|sports) (cash|money)|poker|rummy for money)\b/i;
// Anything regulated needs sourced evidence before it may publish.
const REGULATED_PATTERN =
  /\b(licen[cs]e|licen[cs]ing|fssai|gst|tax|permit|registration|legal|law|compliance|insurance|loan|lending|credit|medical|medicine|pharma\w*|clinic(al)?|diagnos\w*|drone|pesticide|electrical wiring|gas (fitting|cylinder)|financial advice|investment advice)\b/i;
// A customer "operating in India": at least one locating word, or it needs review.
const INDIA_PATTERN =
  /\b(india|indian|bharat|kirana|mandi|panchayat|tehsil|taluk|district|tier[- ](two|three|2|3)|metro|mumbai|delhi|bengaluru|bangalore|chennai|kolkata|hyderabad|pune|ahmedabad|jaipur|lucknow|surat|kochi|indore|bhopal|patna|nagpur|coimbatore|madurai|mysuru|chandigarh|guwahati|bhubaneswar|visakhapatnam|vijayawada|thiruvananthapuram|kerala|tamil nadu|karnataka|maharashtra|gujarat|rajasthan|punjab|bihar|odisha|assam|telangana|andhra|bengal|uttar pradesh|madhya pradesh|hindi|tamil|telugu|kannada|marathi|bengali|gujarati|malayalam|odia|punjabi|urdu|society|gated community|housing society|whatsapp|upi|village|town)\b/i;
const HTML_PATTERN = /<\/?[a-z][^>]*>/i;
const STOPWORDS = new Set(
  "a an the and or of for to in on at by with from your their our who what that this is are be as it its into can will".split(
    " ",
  ),
);

function clean(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/\s*[—–]\s*/g, ", ") // em/en dash -> comma (house style)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text) {
  return clean(text).split(" ").filter(Boolean);
}

function slugify(text) {
  return clean(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function tokens(text) {
  return new Set(
    clean(text)
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

function jaccard(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / (A.size + B.size - inter);
}

function normKey(idea) {
  return [...tokens(`${idea.customer} ${idea.problem} ${idea.offer}`)].sort().join(" ");
}

/**
 * @param {object} output   the model's structured output {new_ideas, existing_fits}
 * @param {object} context  india_job_context(): {set, candidates, recent_titles}
 * @returns {{newIdeas: object[], fits: Record<string,string>, rejects: {title:string, reason:string}[], summary: object}}
 */
function validateGeneration(output, context) {
  const rejects = [];
  const newIdeas = [];
  const fits = {};
  const recentTitles = Array.isArray(context.recent_titles) ? context.recent_titles : [];
  const candidates = Array.isArray(context.candidates) ? context.candidates : [];
  const candidateKeys = new Set(candidates.map((c) => c.concept_key));
  const seenKeys = new Set();
  const seenNorm = new Set();
  const rules = (context.set && context.set.rules) || {};

  const reject = (title, reason) =>
    rejects.push({ title: String(title || "(untitled)").slice(0, 90), reason });

  for (const raw of Array.isArray(output && output.new_ideas) ? output.new_ideas : []) {
    const idea = {};
    for (const f of ["title", ...PROSE_FIELDS, "assumptions", "fit_reason"])
      idea[f] = clean(raw && raw[f]);
    const title = idea.title;

    if (title.length < 8 || title.length > 90) {
      reject(title, "title length");
      continue;
    }
    if (/^(start|begin|launch) (an?|your) \w+ business$/i.test(title)) {
      reject(title, "empty title");
      continue;
    }
    const missing = PROSE_FIELDS.filter((f) => idea[f].length < 10 || idea[f].length > 400);
    if (missing.length) {
      reject(title, `field length: ${missing.join(", ")}`);
      continue;
    }
    if (idea.assumptions && idea.assumptions.length > 400)
      idea.assumptions = idea.assumptions.slice(0, 400);

    const allText = [
      title,
      ...PROSE_FIELDS.map((f) => idea[f]),
      idea.assumptions,
      idea.fit_reason,
    ].join(" ");
    if (HTML_PATTERN.test(allText)) {
      reject(title, "markup in text");
      continue;
    }
    if (NUMBER_PATTERN.test(allText)) {
      reject(title, "contains a number or money figure");
      continue;
    }
    if (OVERCLAIM_PATTERN.test(allText)) {
      reject(title, "overclaim");
      continue;
    }
    if (WAGER_PATTERN.test(allText)) {
      reject(title, "real-money gaming");
      continue;
    }

    const proseWords =
      PROSE_FIELDS.reduce((n, f) => n + words(idea[f]).length, 0) + words(idea.assumptions).length;
    if (proseWords < 90 || proseWords > 260) {
      reject(title, `prose ${proseWords} words (want about 150 to 230)`);
      continue;
    }

    const workMode = String((raw && raw.work_mode) || "").toLowerCase();
    if (!WORK_MODES.includes(workMode)) {
      reject(title, "work_mode");
      continue;
    }
    if (rules.work_modes && !rules.work_modes.includes(workMode)) {
      reject(title, `work_mode ${workMode} not allowed in this set`);
      continue;
    }

    const fitWords = words(idea.fit_reason).length;
    if (fitWords < 3 || fitWords > 35) {
      reject(title, "fit_reason length");
      continue;
    }

    const key = slugify(title);
    if (!key || key.length < 6) {
      reject(title, "concept key");
      continue;
    }
    if (seenKeys.has(key) || candidateKeys.has(key)) {
      reject(title, "duplicate key");
      continue;
    }
    const nk = normKey(idea);
    if (seenNorm.has(nk)) {
      reject(title, "duplicate customer, problem and offer");
      continue;
    }

    let closest = 0;
    for (const t of [
      ...recentTitles,
      ...candidates.map((c) => c.title),
      ...newIdeas.map((n) => n.title),
    ]) {
      closest = Math.max(closest, jaccard(title, t));
    }
    if (closest >= 0.75) {
      reject(title, "near-duplicate title");
      continue;
    }

    let hMin = Number.isInteger(raw && raw.weekly_hours_min) ? raw.weekly_hours_min : null;
    let hMax = Number.isInteger(raw && raw.weekly_hours_max) ? raw.weekly_hours_max : null;
    if (hMin !== null && (hMin < 1 || hMin > 60)) hMin = null;
    if (hMax !== null && (hMax < 1 || hMax > 60)) hMax = null;
    if (hMin !== null && hMax !== null && hMin > hMax) [hMin, hMax] = [hMax, hMin];

    const skills = (Array.isArray(raw && raw.skill_tags) ? raw.skill_tags : [])
      .map((s) => clean(s).toLowerCase())
      .filter((s) => s.length >= 2 && s.length <= 30 && !NUMBER_PATTERN.test(s))
      .slice(0, 6);

    const indiaFit =
      INDIA_PATTERN.test(`${idea.customer} ${idea.customer_reach} ${idea.problem}`) && closest < 0.5
        ? "pass"
        : "needs_review";
    const factual = REGULATED_PATTERN.test(allText) ? "needs_review" : "not_required";

    seenKeys.add(key);
    seenNorm.add(nk);
    newIdeas.push({
      concept_key: key,
      title,
      customer: idea.customer,
      problem: idea.problem,
      offer: idea.offer,
      customer_reach: idea.customer_reach,
      revenue_model: idea.revenue_model,
      first_test: idea.first_test,
      main_risk: idea.main_risk,
      assumptions: idea.assumptions || null,
      skill_tags: skills,
      work_mode: workMode,
      weekly_hours_min: hMin,
      weekly_hours_max: hMax,
      india_fit_status: indiaFit,
      factual_review_status: factual,
    });
    if (indiaFit === "pass" && factual === "not_required") fits[key] = idea.fit_reason;
    else
      reject(
        title,
        `stored for review (${indiaFit === "pass" ? "regulated claim" : "India fit or near-duplicate"})`,
      );
  }

  for (const f of Array.isArray(output && output.existing_fits) ? output.existing_fits : []) {
    const key = f && typeof f.concept_key === "string" ? f.concept_key : "";
    if (!candidateKeys.has(key) || !(f && f.fits === true)) continue;
    const reason = clean(f.fit_reason);
    const n = words(reason).length;
    if (n < 3 || n > 35 || NUMBER_PATTERN.test(reason) || OVERCLAIM_PATTERN.test(reason)) continue;
    fits[key] = reason;
  }

  return {
    newIdeas,
    fits,
    rejects,
    summary: {
      generated: ((output && output.new_ideas) || []).length,
      kept: newIdeas.length,
      fitted: Object.keys(fits).length,
      rejected: rejects.length,
    },
  };
}

/** Planner: validate the agent's set introductions. Returns {ok: [...], rejects: [...]} */
function validateBriefCopy(items, briefs) {
  const bySlug = new Map(briefs.map((b) => [b.slug, b]));
  const ok = [];
  const rejects = [];
  for (const raw of Array.isArray(items) ? items : []) {
    const brief = bySlug.get(raw && raw.slug);
    if (!brief) continue;
    const introduction = clean(raw.introduction);
    const criterion = clean(raw.selection_criterion);
    const audience = clean(raw.audience).slice(0, 120) || null;
    const iw = words(introduction).length;
    const all = `${introduction} ${criterion} ${audience || ""}`;
    if (iw < 12 || iw > 100 || introduction.length > 800) {
      rejects.push({ slug: brief.slug, reason: "introduction length" });
      continue;
    }
    if (criterion.length < 10 || criterion.length > 300) {
      rejects.push({ slug: brief.slug, reason: "criterion length" });
      continue;
    }
    if (
      (NUMBER_PATTERN.test(all) && brief.family !== "budget") ||
      OVERCLAIM_PATTERN.test(all) ||
      HTML_PATTERN.test(all)
    ) {
      rejects.push({ slug: brief.slug, reason: "numbers or overclaim" });
      continue;
    }
    ok.push({
      slug: brief.slug,
      title: brief.title,
      family: brief.family,
      hero_variant: brief.hero_variant,
      pilot: Boolean(brief.pilot),
      introduction,
      selection_criterion: criterion,
      audience,
      requested_count: 12,
      selection_rules: Object.assign({ min_items: 8, max_items: 12 }, brief.rules || {}),
    });
  }
  return { ok, rejects };
}

/** Publisher: validate the reviewer agent's verdicts. */
function validateReview(items, queue) {
  const keys = new Set(queue.map((q) => q.concept_key));
  const out = [];
  for (const r of Array.isArray(items) ? items : []) {
    if (!r || !keys.has(r.concept_key)) continue;
    const verdict = r.verdict === "pass" ? "pass" : "reject"; // anything unclear is a reject
    out.push({ concept_key: r.concept_key, verdict, note: clean(r.note).slice(0, 300) });
  }
  return out;
}

if (typeof module !== "undefined") {
  module.exports = {
    validateGeneration,
    validateBriefCopy,
    validateReview,
    clean,
    slugify,
    jaccard,
  };
}
