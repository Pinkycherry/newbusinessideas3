// node --test n8n/india/test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../lib/validate.js", import.meta.url), "utf8");
const { validateGeneration, validateBriefCopy, validateReview } = new Function(
  `${src}; return { validateGeneration, validateBriefCopy, validateReview };`,
)();

const ctx = {
  set: { rules: { work_modes: ["local", "hybrid"] } },
  candidates: [
    { concept_key: "existing-shop-photos-idea", title: "Photo sets for kirana stores on WhatsApp" },
  ],
  recent_titles: ["Tiffin delivery coordination for office workers in Pune"],
};

const good = (over = {}) => ({
  title: "Catalogue photos for saree shops in Surat markets",
  customer:
    "A saree shop owner in a Surat textile market who sells to regular buyers through WhatsApp broadcasts and a small Instagram page.",
  problem:
    "Phone photos taken in poor shop light make fabrics look dull, so buyers keep asking for more pictures and some stop replying.",
  offer:
    "A morning shoot inside the shop using window light and a plain backdrop, then a set of edited photos arranged by fabric and colour.",
  customer_reach:
    "Walk the market lane with a before and after sample on your phone and show it to owners during quiet afternoon hours.",
  revenue_model:
    "A fixed fee for each batch of edited photos, agreed before the shoot, with repeat work each time new stock arrives.",
  first_test:
    "Offer one shop a free sample of a few sarees, then ask whether they would pay for their next arrival of stock.",
  main_risk:
    "Owners may not see the value until photos change how buyers respond, and that can take longer than a single batch.",
  assumptions:
    "You already own a phone with a decent camera and can speak the language the shop owner uses with customers.",
  skill_tags: ["photography", "editing"],
  work_mode: "local",
  weekly_hours_min: 6,
  weekly_hours_max: 12,
  fit_reason:
    "Shop owners you can walk to are the whole market for this, and the work is done on site.",
  ...over,
});

test("a solid local idea passes and gets a fit reason", () => {
  const r = validateGeneration({ new_ideas: [good()], existing_fits: [] }, ctx);
  assert.equal(r.newIdeas.length, 1);
  assert.equal(r.newIdeas[0].india_fit_status, "pass");
  assert.equal(r.newIdeas[0].factual_review_status, "not_required");
  assert.equal(r.newIdeas[0].concept_key, "catalogue-photos-for-saree-shops-in-surat-markets");
  assert.ok(r.fits[r.newIdeas[0].concept_key]);
});

test("any number, rupee or scale word is rejected", () => {
  for (const bad of [
    { revenue_model: "Charge ₹500 for each batch of photos agreed before the shoot." },
    { offer: "A set of 20 edited photos arranged by fabric and colour for the owner." },
    { problem: "Buyers ask for more pictures and a lakh of rupees in sales is lost each season." },
  ]) {
    const r = validateGeneration({ new_ideas: [good(bad)], existing_fits: [] }, ctx);
    assert.equal(r.newIdeas.length, 0, JSON.stringify(bad));
    assert.match(r.rejects[0].reason, /number/);
  }
});

test("overclaims and real-money gaming are rejected", () => {
  assert.equal(
    validateGeneration(
      {
        new_ideas: [
          good({
            main_risk: "There is little risk because demand is proven in every market lane nearby.",
          }),
        ],
      },
      ctx,
    ).newIdeas.length,
    0,
  );
  assert.equal(
    validateGeneration(
      {
        new_ideas: [
          good({
            offer: "Run fantasy sports cash contests and betting pools for shop owners after work.",
          }),
        ],
      },
      ctx,
    ).newIdeas.length,
    0,
  );
});

test("regulated claims are stored for review, never fitted", () => {
  const r = validateGeneration(
    {
      new_ideas: [
        good({
          assumptions:
            "You will need a trade licence and GST registration before the first paid shoot.",
        }),
      ],
    },
    ctx,
  );
  assert.equal(r.newIdeas.length, 1);
  assert.equal(r.newIdeas[0].factual_review_status, "needs_review");
  assert.deepEqual(r.fits, {});
});

test("no Indian setting means India fit needs review", () => {
  const r = validateGeneration(
    {
      new_ideas: [
        good({
          customer:
            "A small clothing shop owner who sells to regular buyers through message broadcasts and a small online page.",
          customer_reach:
            "Visit shops with a before and after sample on your phone and show it to owners during quiet afternoon hours.",
          problem:
            "Phone photos taken in poor light make fabrics look dull, so buyers keep asking for more pictures and some stop replying.",
        }),
      ],
    },
    ctx,
  );
  assert.equal(r.newIdeas[0].india_fit_status, "needs_review");
});

test("work mode outside the set's rules is rejected", () => {
  const r = validateGeneration({ new_ideas: [good({ work_mode: "online" })] }, ctx);
  assert.equal(r.newIdeas.length, 0);
});

test("duplicates within a batch and near-duplicate titles are rejected", () => {
  const r = validateGeneration(
    {
      new_ideas: [
        good(),
        good({ title: "Catalogue photos for saree shops in Surat market lanes" }),
      ],
    },
    ctx,
  );
  assert.equal(r.newIdeas.length, 1);
  const r2 = validateGeneration(
    { new_ideas: [good({ title: "Tiffin delivery coordination for office workers in Pune" })] },
    ctx,
  );
  assert.equal(r2.newIdeas.length, 0);
});

test("em dashes are rewritten, markup rejected", () => {
  const r = validateGeneration(
    {
      new_ideas: [
        good({
          offer:
            "A morning shoot inside the shop — window light, plain backdrop — then edited photos arranged by fabric.",
        }),
      ],
    },
    ctx,
  );
  assert.doesNotMatch(r.newIdeas[0].offer, /[—–]/);
  assert.equal(
    validateGeneration(
      {
        new_ideas: [
          good({
            offer:
              "A morning shoot <b>inside</b> the shop using window light and a plain backdrop.",
          }),
        ],
      },
      ctx,
    ).newIdeas.length,
    0,
  );
});

test("existing fits only for real candidates that fit, with a clean reason", () => {
  const r = validateGeneration(
    {
      new_ideas: [],
      existing_fits: [
        {
          concept_key: "existing-shop-photos-idea",
          fits: true,
          fit_reason: "Kirana owners nearby need photos to sell on WhatsApp.",
        },
        {
          concept_key: "not-a-candidate",
          fits: true,
          fit_reason: "Invented key must be ignored by the validator.",
        },
        { concept_key: "existing-shop-photos-idea-x", fits: false, fit_reason: "no" },
      ],
    },
    ctx,
  );
  assert.deepEqual(Object.keys(r.fits), ["existing-shop-photos-idea"]);
});

test("planner copy: bounded, no numbers outside the budget family", () => {
  const briefs = [
    { slug: "a-set", title: "A set", family: "time", rules: {} },
    { slug: "b-set", title: "B set", family: "budget", rules: { max_budget_inr: 10000 } },
  ];
  const res = validateBriefCopy(
    [
      {
        slug: "a-set",
        introduction:
          "Ideas for people in India who have weekends free and want to test a small service close to home before committing more time.",
        selection_criterion: "Customers need the service on weekends.",
        audience: "People with weekends free",
      },
      {
        slug: "b-set",
        introduction:
          "Ideas whose sourced budget estimate fits under ₹10,000, for people in India testing a first business with very little money.",
        selection_criterion: "Upper budget estimate at or below ₹10,000.",
        audience: "Beginners with little money",
      },
      { slug: "unknown", introduction: "x", selection_criterion: "x", audience: "x" },
    ],
    briefs,
  );
  assert.equal(res.ok.length, 2);
  assert.equal(res.ok[1].selection_rules.max_budget_inr, 10000);
});

test("review verdicts: unknown keys dropped, unclear verdicts become rejects", () => {
  const out = validateReview(
    [
      { concept_key: "k1", verdict: "pass", note: "ok" },
      { concept_key: "k2", verdict: "maybe" },
      { concept_key: "zz", verdict: "pass" },
    ],
    [{ concept_key: "k1" }, { concept_key: "k2" }],
  );
  assert.deepEqual(
    out.map((o) => o.verdict),
    ["pass", "reject"],
  );
});
