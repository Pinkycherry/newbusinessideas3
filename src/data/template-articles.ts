export type TemplateArticle = {
  definition: string;
  use: string;
  example: string;
  chapters: { title: string; explanation: string; question: string }[];
  method: string[];
  do: string[];
  avoid: string[];
  faq: { q: string; a: string }[];
};

/** Editorial adaptations of the purchased persona/interview pages and four plan PDFs. No fabricated figures. */
export const TEMPLATE_ARTICLES: Record<string, TemplateArticle> = {
  "customer-persona": {
    definition: "A customer persona is a record of what a particular kind of buyer is trying to do, what they use today and why they hesitate. It becomes useful when its claims come from actual conversations. A name and age alone cannot explain a purchase. In India, the person using a service, the person deciding and the person paying may be three different people.",
    use: "Read each part as a question to investigate. Speak to buyers first, write down their own words and mark anything you have not observed as an assumption. A persona should change when evidence changes; it is not a fictional character you need to defend.",
    example: "For a summer drink cart, ‘everyone who feels hot’ tells you little. A more useful starting point is a commuter who passes a particular stand after work, chooses between nearby sellers and decides whether the water and preparation feel trustworthy. That is a question to test at the location, not a claim about all commuters.",
    chapters: [
      { title: "Buyer and setting", explanation: "Begin with a real buying moment. Note where the person is, what they were doing and whether they choose or merely use the product. The context often explains more than a broad demographic label.", question: "Who is present when the decision happens, and who actually pays?" },
      { title: "The event that starts the search", explanation: "Trace what happened just before the buyer looked for help. A recent incident gives you something observable to discuss; a general wish often produces polite answers with little value.", question: "What changed on the day they looked for another option?" },
      { title: "Current alternative", explanation: "Your competition includes habits, favours and doing nothing. Ask how the buyer handles the problem now, what they accept about that option and what frustrates them enough to switch.", question: "What did they use last time, and why did they choose it?" },
      { title: "Desired outcome and objections", explanation: "Describe what progress means in the buyer's words. Then record the friction: price, travel, uncertainty, quality, family approval or fear of wasting time. Keep a direct quote when you have one.", question: "What would make the buyer trust a new provider?" },
      { title: "Reach and evidence", explanation: "Name the actual shop, group, referral or search path through which the buyer learns about options. Separate what a buyer said from your interpretation, and note the next conversation that could disprove your profile.", question: "Which part of the profile remains only your guess?" },
    ],
    method: ["Start with a buyer you can reach, not a market label.", "Ask about a recent purchase or workaround and record the exact language.", "Compare different buyers' answers for recurring decisions and objections.", "Rewrite the profile when a real conversation contradicts it."],
    do: ["Write the job the buyer is trying to finish before listing demographics.", "Keep observed words separate from your assumptions.", "Include the person who approves or pays when they differ from the user."],
    avoid: ["Inventing a biography to make a slide feel complete.", "Treating every buyer in a city or age band as identical.", "Calling a persona validated after speaking only to friends."],
    faq: [
      { q: "Is a persona the same as a target market?", a: "A target market names a broad group. A useful persona describes a particular buying situation, decision and obstacle grounded in evidence." },
      { q: "What if the buyer and payer differ?", a: "Record both roles. For example, one person may use a service while a family member chooses and pays for it." },
      { q: "When should I revise it?", a: "Revise it whenever a buyer conversation or actual purchase challenges an assumption that affects the offer or sales path." },
    ],
  },
  "customer-interview": {
    definition: "A customer interview is a conversation about something that already happened. The aim is to hear a buyer's real problem, workaround and decision without telling them what you hope to sell. The useful part is the order of questions and the discipline of listening.",
    use: "Take a few neutral questions into a conversation. You do not need to read them like a survey. Follow the buyer's most recent story, ask what they did and record their words. Avoid asking whether they would buy an imagined product; courtesy can sound like demand.",
    example: "If you are exploring a summer drink cart, ask someone passing the location where they bought a drink last time, what made them stop, what they paid and whether they returned. Do not begin by asking if they would love your new cart.",
    chapters: [
      { title: "Choose the person and learning goal", explanation: "Speak to someone who faced the relevant situation recently. State the one assumption this conversation could change. This prevents a long discussion that produces nothing you can act on.", question: "Which decision will you reconsider after hearing the answer?" },
      { title: "Open with a recent incident", explanation: "Ask the buyer to take you through the last time the problem appeared. Their account of a particular day is more useful than an abstract opinion about a category.", question: "Can you tell me what happened the last time this came up?" },
      { title: "Explore the workaround", explanation: "Ask what they tried, who helped, which options they rejected and what inconvenience remained. Do not assume that your idea is the only alternative they considered.", question: "What did you do before choosing the option you used?" },
      { title: "Understand the choice and payment", explanation: "Find out who chose, who paid and why the chosen option felt safe or worthwhile. If they remember a real price or cost, record it as their account; do not turn it into a market average.", question: "Who made the final choice and what mattered most?" },
      { title: "Close and compare", explanation: "Ask what the buyer would do next time, thank them and request permission before any follow-up. Afterward, separate direct quotes from your inference and compare stories across buyers.", question: "What would you do if the same situation happened tomorrow?" },
    ],
    method: ["Recruit people who recently faced the problem, beyond your friends.", "Start with a past event and let the buyer explain it without interruption.", "Probe the decision and payment without pitching your solution.", "Compare exact quotes and actions, then test the strongest pattern in the field."],
    do: ["Leave room for silence and unexpected answers.", "Ask permission before recording or contacting someone again.", "Note the buyer's actual words and the context in which they said them."],
    avoid: ["Asking ‘would you buy my idea?’ as your main evidence.", "Explaining your product before hearing the last real incident.", "Treating compliments or hypothetical promises as sales."],
    faq: [
      { q: "How many conversations are enough?", a: "There is no universal number. Keep speaking with relevant buyers until the same decision patterns recur, and test those patterns through real behaviour." },
      { q: "Should I record the conversation?", a: "Only with clear permission. Good notes with exact quotes and context are useful when recording is inappropriate." },
      { q: "What makes a question leading?", a: "A leading question suggests the answer you want, such as asking someone to praise a feature. Ask what they did last time instead." },
    ],
  },
  "lean-canvas": {
    definition: "A lean canvas puts the main assumptions about one business idea in a single view. Its boxes are not proof. They help you see what you believe about buyers, the offer, the route to market and the money, so you can choose which belief to test first.",
    use: "Read the nine boxes in the purchased canvas as a connected argument. A buyer with a clear problem should lead to a small offer, a reachable channel and a way to earn more than the work costs. Leave an uncertain box uncertain; a neat canvas is not a reason to spend money.",
    example: "A summer drink cart canvas could start with commuters near one location, their current alternatives and the specific reason they stop. The cost box would use actual local quotes for fruit, ice and transport. The demand claim stays an assumption until people buy at that location.",
    chapters: [
      { title: "Problem", explanation: "Name the difficulty the buyer already notices. A problem is more useful when you can point to a recent incident, present workaround or cost of leaving it unresolved.", question: "What has the buyer tried already?" },
      { title: "Customer segments", explanation: "Identify the first group you can reach and serve, rather than everyone who might theoretically use the offer. Note who pays when the user and payer differ.", question: "Where can you meet the first real buyers?" },
      { title: "Unique value proposition", explanation: "State the improvement a buyer would choose you for. Compare it to the next best local alternative, including doing nothing.", question: "Why would the buyer switch?" },
      { title: "Solution", explanation: "Describe the smallest offer that could deliver the promised outcome. Keep features out of the box unless they change the buyer's result.", question: "What could you test before building the full operation?" },
      { title: "Channels", explanation: "Show how the buyer will discover, trust and contact you. A channel is a path you can try, not a list of every platform you have heard of.", question: "Where did similar buyers find their current option?" },
      { title: "Revenue streams", explanation: "Explain who pays, for what and how often. Use ₹ figures only when they are based on your own price test or clearly labelled estimates.", question: "What transaction would count as real demand?" },
      { title: "Cost structure", explanation: "List the inputs needed before a first sale and those that recur with each order. Get local quotes before turning the box into a cash forecast.", question: "Which costs happen even if no customer arrives?" },
      { title: "Key metrics", explanation: "Choose observations that would change your decision: completed purchases, repeat use or another behaviour tied to the business model. Avoid decorative numbers.", question: "What would tell you that buyers actually value the offer?" },
      { title: "Unfair advantage", explanation: "Write a real edge you already hold or can build, such as trusted access or a hard-to-copy process. If there is none yet, say so rather than inventing one.", question: "What could a nearby competitor copy tomorrow?" },
    ],
    method: ["Read every box as a hypothesis, not a certificate.", "Choose the highest-risk assumption that can be checked cheaply.", "Speak to buyers or run a small real-world test.", "Update the canvas with evidence before increasing the commitment."],
    do: ["Connect the buyer, problem, offer and channel in one argument.", "Mark prices and costs as measured or estimated.", "Revisit the canvas when the first transactions contradict it."],
    avoid: ["Treating a filled box as validation.", "Using a generic customer group to avoid choosing a first buyer.", "Adding a claim of advantage that any competitor can copy."],
    faq: [
      { q: "Does a lean canvas replace a business plan?", a: "It helps you expose assumptions quickly. A fuller plan is useful when operations, funding or partners require more detail." },
      { q: "Which box should I start with?", a: "Start with a buyer and problem you can investigate. The remaining boxes become easier to test when those are specific." },
      { q: "Can I change it after launch?", a: "Yes. A canvas should change as real costs, purchases and buyer behaviour become visible." },
    ],
  },
  "one-page-business-plan": {
    definition: "The one-page plan has ten parts. Its purpose is to make the business understandable in a short conversation, not to squeeze a long proposal into tiny type. Each part should answer one decision question using facts you know and assumptions you can test.",
    use: "Read through the ten parts in order, then revisit the opening line once the buyer, offer and money are clearer. Keep explanations short enough that a partner could repeat them. A plan can be concise without pretending that an unknown is solved.",
    example: "For a local tailoring service, ‘we stitch clothes’ is too broad. A useful short plan would name the first customer, the alteration they need, how orders are collected, the real equipment cost and the route to the first paying order. Prices remain estimates until tested.",
    chapters: [
      { title: "Company and vision", explanation: "Say what you will offer and the change you want for your buyer. Make the sentence concrete enough that someone can tell what the business does.", question: "Could a first customer recognise their problem in this line?" },
      { title: "The problem", explanation: "Describe a specific difficulty the buyer faces today and how it is currently handled. Do not claim a broad market size in place of evidence.", question: "What recent situation shows this problem exists?" },
      { title: "Your solution", explanation: "Explain the outcome the offer improves, then what you actually deliver. A list of features without a buyer result does not explain the business.", question: "What changes for the customer after buying?" },
      { title: "Target customer", explanation: "Name who chooses, pays and uses the offer, plus where you can reach them. A narrow first buyer is easier to learn from than a broad demographic label.", question: "Who will give you the first honest answer?" },
      { title: "Unique value proposition", explanation: "Compare your offer to the buyer's next best option and say why switching would be worthwhile. Keep the claim testable.", question: "What can the buyer get from you that matters to them?" },
      { title: "Revenue model and pricing", explanation: "State what the buyer pays for and when money arrives. Show a real ₹ price only if you have one; otherwise label it as a proposal.", question: "What does one completed sale look like?" },
      { title: "Go-to-market channels", explanation: "Choose routes you can actually try for first customers. Describe how people discover, trust and contact the business.", question: "Which route could lead to a first conversation this week?" },
      { title: "Key metrics", explanation: "Choose a few signs that the model works, such as a completed sale or repeat order. Count what would change your next decision, not every possible number.", question: "What behaviour would make you continue?" },
      { title: "Cost structure", explanation: "Separate starting expenses from costs that recur with each order. Ask local suppliers for actual quotes before assuming a margin.", question: "What must be paid even before the first sale?" },
      { title: "Team and advantage", explanation: "Name who will do the work and what capability, access or relationship the team already has. Do not turn a hoped-for partnership into a current asset.", question: "What can this team deliver reliably now?" },
    ],
    method: ["Read all ten parts before writing the opening statement.", "Ground the buyer and current alternative in a conversation.", "Mark ₹ costs and prices as quotes, tests or estimates.", "Use the plan to decide the next field test, then revise it."],
    do: ["Keep the buyer and their outcome visible throughout.", "Use plain words a partner could repeat.", "Separate observed facts from proposed prices and channels."],
    avoid: ["Replacing evidence with a confident headline.", "Listing every possible customer or sales channel.", "Presenting an estimate as actual revenue."],
    faq: [
      { q: "Is one page enough for a loan?", a: "It can start a conversation. A lender may also need detailed financials, documents and a fuller plan." },
      { q: "What if I do not know a price yet?", a: "Label it as a proposed ₹ price and test it with buyers. Do not turn a guess into a confirmed figure." },
      { q: "When should I update the plan?", a: "Update it after buyer conversations, supplier quotes or sales change a meaningful assumption." },
    ],
  },
  "saas-business-plan": {
    definition: "The SaaS plan is organised into eight chapters: summary, product, market, route to buyers, SaaS measures, pricing, team and financials. These chapters should tell one connected story about a software buyer and a business that can keep serving them.",
    use: "Start with the buyer's existing workflow and the smallest product that makes it better. Then trace how that person discovers, adopts, pays for and continues using it. Revenue, acquisition and retention figures belong in the plan only when you can label what is measured and what is assumed.",
    example: "A software service for local shop stock checks should begin with how a shopkeeper currently notices missing items, who would use the tool and who approves payment. A clean interface alone cannot answer whether the shop will keep paying; repeat use and a price conversation can.",
    chapters: [
      { title: "Executive summary", explanation: "Write the summary after the other chapters. State the buyer, product, current stage, real traction if any and what decision or support you seek.", question: "Which claims can you substantiate today?" },
      { title: "Product", explanation: "Describe the task the software changes and the first experience that delivers value. Explain what exists now versus what is still planned.", question: "What can a user finish sooner or better?" },
      { title: "Market and ideal customer", explanation: "Identify the first buyer, user and approver. Compare their present tools and workarounds rather than relying on a broad software category.", question: "Who feels the problem and who pays to solve it?" },
      { title: "Go-to-market", explanation: "Trace how a buyer hears about the product, tries it, trusts it and becomes a paying user. Choose a route you can test with reachable people.", question: "Where will the first qualified conversations come from?" },
      { title: "SaaS metrics", explanation: "Explain activation, continued use, cancellation and acquisition cost in terms of the product's actual buyer journey. If there are no customers yet, name the measurement plan instead of inventing a chart.", question: "What repeated behaviour would show lasting value?" },
      { title: "Pricing", explanation: "State who pays, what is included and what makes the price believable. Compare the buyer's current cost and test a proposed ₹ price rather than importing another market's price.", question: "What would make the offer worth paying for now?" },
      { title: "Team and hiring", explanation: "Describe the skills the current team really has and the work it cannot yet cover. Hiring is a response to a demonstrated need, not a decorative org chart.", question: "Who builds, supports and sells the product today?" },
      { title: "Financials and funding", explanation: "Separate actual infrastructure, support and sales costs from estimates. Show how long current resources last and what a funding request would change.", question: "What milestone would make further spending sensible?" },
    ],
    method: ["Begin with a buyer's existing workflow.", "Test the smallest product outcome and record actual use.", "Measure repeat behaviour before projecting retention.", "Revise pricing and spending when customer evidence changes."],
    do: ["Distinguish buyers, users and approvers.", "Label measured and projected numbers plainly.", "Explain why customers would continue paying after the first month."],
    avoid: ["Copying foreign SaaS prices as Indian willingness to pay.", "Calling signups evidence of retention.", "Showing projections without the assumptions behind them."],
    faq: [
      { q: "Can I plan a SaaS business before there are users?", a: "Yes, if you label the unknowns and plan how to test them. Do not present projected usage as actual traction." },
      { q: "Which measure matters first?", a: "Start with whether a relevant buyer reaches the product's promised outcome. Retention matters once there are users to observe over time." },
      { q: "Should I copy a global competitor's price?", a: "Use it as one reference, then test what your specific buyer will pay in ₹ for the outcome you provide." },
    ],
  },
  "standard-business-plan": {
    definition: "The standard business plan has nine chapters. It is for a business that needs to explain its operations and finances to a partner, lender or decision maker. The value is in connecting the buyer, the work required to serve them and the cash needed to keep that work going.",
    use: "Read the chapters as a sequence of evidence, not a form to fill for its own sake. Speak to buyers, get supplier quotes and make the delivery steps concrete before making financial claims. A lender can ask for separate supporting records; this page explains what the plan should contain.",
    example: "A neighbourhood tailoring shop plan would identify the first alteration customers, existing local options, equipment and rent quotes, who handles fittings, how payment arrives and what happens when an order must be redone. Those practical details make the financial section more credible.",
    chapters: [
      { title: "Executive summary", explanation: "Write this last. Give the reader a clear picture of the offer, buyer, location, evidence so far and any funding request in ₹.", question: "Can every major claim point to a later section?" },
      { title: "Company description", explanation: "Explain the current business stage, ownership, location and purpose. Distinguish a registered entity from a planned one and name permissions only where relevant.", question: "What is already operating, and what is proposed?" },
      { title: "Market analysis", explanation: "Describe the first customers and what you have learned from them. Compare local shops, services and informal workarounds; a big market claim cannot replace field evidence.", question: "Why would this buyer switch from the current option?" },
      { title: "Organisation and management", explanation: "Show who performs sales, delivery, accounts and quality checks. If one person handles several roles, state that honestly and note where help will become necessary.", question: "Who is responsible when an order goes wrong?" },
      { title: "Product or service line", explanation: "Explain exactly what the buyer receives, how it is delivered and what it takes to maintain quality. Keep future additions separate from the first offer.", question: "What is included in one completed order?" },
      { title: "Marketing and sales strategy", explanation: "Trace how people discover you, judge trust, place an order, pay and come back. Choose channels you can test rather than listing every platform.", question: "Where will the first paid orders come from?" },
      { title: "Funding request", explanation: "If funding is relevant, state the ₹ amount, the specific use and the milestone it should enable. Match the request to real quotes and expected cash needs.", question: "What would change if the request were approved?" },
      { title: "Financial projections", explanation: "Separate startup costs, monthly fixed costs and per-order costs. Explain payment timing and the assumptions behind sales and cash flow; estimates are not past results.", question: "Can the business pay bills before customers pay it?" },
      { title: "Appendix", explanation: "Keep supporting evidence accessible: supplier quotes, customer research, licences where applicable and detailed calculations. Include only documents that support a claim in the main plan.", question: "Which statement in the plan needs proof?" },
    ],
    method: ["Collect buyer accounts and local supplier quotes.", "Map the exact work from enquiry to delivery and payment.", "Write costs and cash timing before optimistic sales projections.", "Summarise the plan last and check every claim against evidence."],
    do: ["Keep facts, estimates and plans visibly separate.", "Explain operations in enough detail to expose costs.", "Use ₹ amounts only when they come from a quote, transaction or labelled estimate."],
    avoid: ["Treating a template as a loan approval.", "Hiding the gap between order and payment.", "Copying another business's margins or projections."],
    faq: [
      { q: "Does this page replace a lender's required forms?", a: "No. A lender may specify financial records, application forms and evidence beyond a business plan." },
      { q: "Do I need a funding request?", a: "Only if you are seeking funding. Otherwise, explain how the business will cover its costs and next milestone." },
      { q: "How do I handle numbers I cannot confirm?", a: "Label them as estimates and show the assumptions. Get actual local quotes and buyer evidence before relying on them." },
    ],
  },
};
