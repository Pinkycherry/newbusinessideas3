import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Calculator, Compass, MessagesSquare } from "lucide-react";

import { Bullets, ContentPage, Section, metaFor } from "@/components/glass-editorial";

export const Route = createFileRoute("/services")({
  head: () => metaFor(
    "What You Can Do Here | BusinessIdea.io",
    "Explore completed business blueprints, check your numbers, learn with practical guides and take a prepared validation prompt to your choice of AI research tool.",
  ),
  component: ServicesPage,
});

const paths = [
  { name: "Find a business direction", description: "Start in the category map, then search the separate index of completed source blueprints for a published idea you can read in full.", to: "/blueprints", action: "Explore published ideas", icon: Compass },
  { name: "Run the numbers", description: "Bring your own costs and assumptions to the live calculators. The formula and input fields stay visible so you can question the output.", to: "/calculator", action: "Open calculators", icon: Calculator },
  { name: "Learn before you spend", description: "Read the existing startup guides, journal articles and glossary alongside a blueprint. Move from the broad idea to the first practical test.", to: "/startup-guides", action: "Read startup guides", icon: BookOpen },
  { name: "Ask a human", description: "If your question needs a person, contact the team. Explain your market and what you have already checked so the reply can be useful.", to: "/contact", action: "Contact the team", icon: MessagesSquare },
] as const;

function ServicesPage() {
  return <ContentPage
    eyebrow="What you can do"
    title="From first thought to"
    highlight="a useful test"
    intro="Choose a direction, examine a completed blueprint, calculate with your own assumptions, then validate what matters. Each step below links to something available on this demo today."
    wide
  >
    <div className="gl-service-grid">
      {paths.map(({ name, description, to, action, icon: Icon }) => <article key={name} className="gl-service-card">
        <span className="gl-service-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
        <h2>{name}</h2><p>{description}</p>
        <Link to={to}>{action}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </article>)}
    </div>
    <Section heading="Start with your situation">
      <p>Time, location, starting money and skills all change which idea is sensible. Browse the category map if you are still deciding what kind of work fits. Its focused paths are a way to narrow the question, not a promise that each path already has published ideas.</p>
      <p><Link to="/browse">Browse categories</Link> or <Link to="/blueprints">search completed blueprints</Link>. The latter is a separate index because the source catalog and the new category map do not yet have a verified one-to-one assignment.</p>
    </Section>
    <Section heading="Read the full blueprint">
      <p>A completed idea page brings together the business description, customers, revenue route, costs, obstacles and launch steps from the original published record. Look for the parts that could rule the idea out in your market before you invest.</p>
      <p>Original source images and their descriptive text appear with the idea wherever a mapped asset exists. Use the page links to move to another idea if the first one is a poor fit.</p>
    </Section>
    <Section heading="Validate with the model you choose">
      <p>Every completed blueprint has a Validate button. It prepares a structured research prompt and lets you choose Claude, Perplexity, ChatGPT or Grok. The chosen provider opens with the prompt; its own sign-in or usage rules may apply.</p>
      <p>BBI does not generate or sell an automatic validation report on this demo. Treat an AI answer as a starting hypothesis: check local demand, speak to potential buyers and test the numbers yourself.</p>
      <p><Link to="/startup-idea-validation">Work through the startup idea validation field guide</Link> to turn those questions into buyer conversations, a reversible offer and an evidence-based next decision.</p>
      <Bullets items={["Name the exact buyer and the problem they already pay to solve.", "Ask for opposing evidence and the conditions that would make the idea fail.", "Cross-check any market figure against a source you can open.", "Try one small customer test before committing to a full launch."]} />
    </Section>
    <Section heading="Make the numbers yours">
      <p>Use the calculators for startup cost, break-even, runway, customer acquisition or other focused questions. Replace example inputs with your situation and compare more than one scenario. The output is arithmetic based on what you enter, not a forecast.</p>
      <p><Link to="/calculator">Open the calculator library</Link>, then <Link to="/startup-guides">read the matching guide</Link> when a formula needs context.</p>
    </Section>
    <Section heading="Keep learning as you decide">
      <p>The startup guides cover validation, market sizing, cash flow, hiring, pricing and more. Published journal articles offer practical examples, while the glossary explains the language behind the numbers.</p>
      <p><Link to="/learning-resources">Open the learning hub</Link> to choose the next resource. You can also <Link to="/contact">write to the team</Link> about a specific question.</p>
    </Section>
  </ContentPage>;
}
