/** Original schedule and offer context for the ten approved part-time collections. */
export const PART_TIME_PATHS: Record<string, { lead: string; question: string; checks: [string, string]; nextLabel: string; nextHref: string }> = {
  "morning-meal-round-business-ideas": {
    lead: "A morning meal round has a hard deadline: breakfast cannot arrive at lunch. Compare cooking, packing and delivery time before you accept the first recurring order.",
    question: "Can the route stay reliable?",
    checks: ["Decide the last time a customer may place or change an order.", "Count ingredients, packaging, delivery and unsold food in the first price."],
    nextLabel: "Test a smaller first order", nextHref: "/business-demand-test-india",
  },
  "after-office-coaching-batch-business-ideas": {
    lead: "Your own workday ends before a student's class begins. Pick a subject you can teach, a fixed slot and the preparation time behind every hour in front of the batch.",
    question: "Can you keep the same class slot?",
    checks: ["Ask a learner which specific lesson they would pay to practise.", "Write down class time, lesson preparation and follow-up before quoting a monthly fee."],
    nextLabel: "Shape a first teaching offer", nextHref: "/business-pricing-india",
  },
  "weekend-market-stall-business-ideas": {
    lead: "A stall can give you buyer feedback in a single day. The table fee, stock, samples and travel still have to come out of the takings.",
    question: "What would a good market day mean?",
    checks: ["Ask the organiser about the actual stall fee and permitted products.", "Plan the smallest stock batch you can carry home if it does not sell."],
    nextLabel: "Check one market day's surplus", nextHref: "/weekend-market-stall-profit-check",
  },
  "part-time-shop-accounts-help-business-ideas": {
    lead: "A shop may need regular help with records but cannot hand over an open-ended pile of work. Define the documents, deadline and responsibility before offering a weekly slot.",
    question: "Where does your job end?",
    checks: ["Ask which records are missing, late or difficult to reconcile.", "Separate bookkeeping support from qualified tax or legal advice."],
    nextLabel: "Find the first shop buyer", nextHref: "/first-customer-india",
  },
  "evening-hobby-batch-business-ideas": {
    lead: "People join a class because they want to make or learn something specific. Give one evening a clear promise, a sensible class size and a finish time.",
    question: "What can a learner complete?",
    checks: ["Describe the skill or item a beginner will leave with.", "Count materials, setup and cleaning as part of the class cost."],
    nextLabel: "Work out a first class price", nextHref: "/business-pricing-india",
  },
  "part-time-event-photography-business-ideas": {
    lead: "The event lasts a few hours; culling, editing and delivery can take longer. A first offer needs a defined shoot, image count and handover date.",
    question: "What exactly will the client receive?",
    checks: ["Agree the location, hours and number of edited images in writing.", "Allow time for travel, backups and revisions before you accept another booking."],
    nextLabel: "Set a bounded service offer", nextHref: "/service-business-ideas-india",
  },
  "weekend-catering-order-business-ideas": {
    lead: "A weekend order begins with shopping and prep, and ends after clean-up. Keep the first menu narrow and the order count within the kitchen you actually have.",
    question: "How many orders can you fulfil?",
    checks: ["Fix the menu, quantity, cut-off and delivery or pickup terms.", "Check applicable local food requirements and the cost of packaging."],
    nextLabel: "Plan the first batch cost", nextHref: "/startup-costs-india",
  },
  "part-time-online-selling-business-ideas": {
    lead: "Listing a product is a small part of selling it. Packing, replies, returns and payment timing must fit the same part-time week.",
    question: "Can fulfilment fit your evenings?",
    checks: ["Choose one product and record the full order-to-delivery steps.", "Test the cost of fees, packaging and a returned order before buying stock."],
    nextLabel: "Check one order's economics", nextHref: "/unit-economics-india",
  },
  "school-gate-help-service-business-ideas": {
    lead: "School timings create a narrow window and a high duty of care. Be exact about the service, who gives permission and what happens if plans change.",
    question: "Who is responsible at handover?",
    checks: ["Write the pickup or support boundary with the family and school.", "Plan for delays, emergency contacts and local requirements before a trial."],
    nextLabel: "Check the first risk boundary", nextHref: "/business-idea-risk-check",
  },
  "part-time-repair-visit-business-ideas": {
    lead: "A short repair visit can expand if the fault, parts or travel are uncertain. Start with work you are trained to do and a clear diagnostic promise.",
    question: "What can you diagnose safely?",
    checks: ["Define the visit area and what the initial fee includes.", "Get approval before buying parts or doing work beyond the agreed scope."],
    nextLabel: "Price a first service visit", nextHref: "/business-pricing-india",
  },
};
