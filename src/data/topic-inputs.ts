/**
 * Page-specific one-tap questions for the Validate button, keyed by topic-page slug (founder, 5 Nov 2026).
 * They are shown after the common questions (language, place, online/offline, budget, social following, stage)
 * and go into the one universal prompt (src/lib/topic-validate-prompt.ts). Every page gets its own set.
 * A page may also set `inputs` in its own data file; that wins over this list.
 */
export type InputGroup = { label: string; options: string[] };

export const TOPIC_INPUTS: Record<string, InputGroup[]> = {
  "how-to-validate-a-business-idea-in-india": [
    { label: "Type of idea", options: ["Food", "Service", "Product", "Online store", "App or software"] },
    { label: "Buyers I have spoken to", options: ["None yet", "1–5", "6–10", "More than 10"] },
  ],
  "how-to-get-funding-for-a-small-business-in-india": [
    { label: "Money needed for", options: ["Machines or equipment", "Stock or raw material", "Shop setup", "Running costs"] },
    { label: "Collateral I can offer", options: ["None", "Gold", "Property", "Fixed deposit"] },
    { label: "Category", options: ["General", "Woman entrepreneur", "SC/ST entrepreneur", "Ex-serviceman"] },
  ],
  "common-mistakes-to-avoid-when-starting-a-business-in-india": [
    { label: "My biggest worry", options: ["Losing savings", "No buyers", "Family pressure", "Licences and GST"] },
    { label: "Already spent on", options: ["Nothing yet", "Rent or deposit", "Stock", "Machines or app"] },
  ],
  "what-is-customer-acquisition-cost-for-a-small-business-in-india": [
    { label: "Where my customers come from", options: ["Word of mouth", "WhatsApp groups", "Instagram or Facebook ads", "Marketplace", "Pamphlets"] },
    { label: "Customers buy", options: ["Once", "Every month", "Every week", "Daily"] },
  ],
  "how-to-calculate-tam-sam-som-for-a-business-in-india": [
    { label: "Who buys", options: ["Households", "Students", "Shops and businesses", "Farmers"] },
    { label: "Area I can serve", options: ["My ward or colony", "Whole city", "District", "All India online"] },
  ],
  "how-much-money-is-needed-to-start-a-business-in-india": [
    { label: "Business type", options: ["Service from home", "Food", "Retail shop", "Small manufacturing", "Online reselling"] },
    { label: "Premises", options: ["Home", "Rented shop", "Shared space", "Own property"] },
  ],
  "how-to-start-a-business-without-investors-in-india": [
    { label: "Customers pay", options: ["In advance", "On delivery", "On credit"] },
    { label: "Family money available", options: ["None", "A little", "Enough for a small test"] },
  ],
  "how-to-know-if-your-business-has-product-market-fit-in-india": [
    { label: "Months selling", options: ["Under 3", "3–6", "6–12", "Over a year"] },
    { label: "Repeat buyers", options: ["Hardly any", "Some", "Most come back"] },
  ],
  "how-to-talk-to-customers-before-starting-a-business-in-india": [
    { label: "My buyers are", options: ["Families", "Students", "Shopkeepers", "Offices", "Farmers"] },
    { label: "I am comfortable", options: ["Meeting in person", "Phone calls", "WhatsApp only"] },
  ],
  "how-to-build-an-mvp-with-low-investment-in-india": [
    { label: "What I am building", options: ["Food product", "Clothing or handmade", "Local service", "Online course", "App or software"] },
    { label: "Tech skills", options: ["None", "Basic", "I can build it"] },
  ],
  "how-to-check-if-your-business-idea-is-good-in-india": [
    { label: "Type of idea", options: ["Food", "Service", "Product", "Online store", "App or software"] },
    { label: "Time I can give", options: ["Weekends only", "Evenings", "Full time"] },
  ],
  "how-to-raise-funds-for-a-startup-in-india": [
    { label: "Company type", options: ["Not registered", "Proprietorship", "LLP", "Private limited"] },
    { label: "DPIIT recognition", options: ["Yes", "No", "Not sure"] },
    { label: "Monthly sales", options: ["None yet", "Some", "Growing every month"] },
  ],
  "business-numbers-every-small-business-in-india-should-track": [
    { label: "Business type", options: ["Kirana or retail", "Food", "Coaching", "Salon or service", "Online store"] },
    { label: "How I keep records", options: ["Notebook", "Billing app", "Excel or Sheets", "Not at all"] },
  ],
  "how-to-write-a-business-plan-for-a-bank-loan-in-india": [
    { label: "Loan scheme", options: ["MUDRA", "PMEGP", "Stand-Up India", "Not sure"] },
    { label: "Unit type", options: ["Manufacturing", "Service", "Trading"] },
  ],
  "how-to-do-competitor-analysis-for-a-small-business-in-india": [
    { label: "Main competitors", options: ["Local shops", "Home sellers", "Big brands", "Online marketplaces"] },
    { label: "What I want to beat them on", options: ["Price", "Quality", "Speed", "Service"] },
  ],
  "startup-funding-questions-for-first-time-founders-in-india": [
    { label: "Thinking about", options: ["Bank loan", "Government scheme", "Angel investor", "Family money"] },
    { label: "Category", options: ["General", "Woman entrepreneur", "SC/ST entrepreneur"] },
  ],
  "how-to-test-demand-with-facebook-and-google-ads-in-india": [
    { label: "Platform", options: ["Instagram and Facebook", "Google search", "Not sure"] },
    { label: "Test budget", options: ["Under ₹1,000", "₹1,000–5,000", "Above ₹5,000"] },
  ],
  "free-government-resources-for-starting-a-business-in-india": [
    { label: "I need help with", options: ["Registration", "Loan or subsidy", "Selling to government", "Training"] },
    { label: "Registered so far", options: ["Nothing", "Udyam", "GST", "Company or LLP"] },
  ],
  "how-to-validate-a-food-business-idea-in-india": [
    { label: "Food business", options: ["Tiffin", "Cloud kitchen", "Street food", "Bakery", "Packaged snacks"] },
    { label: "FSSAI", options: ["Done", "Not yet", "Not sure"] },
  ],
  "how-to-validate-an-online-selling-business-idea-in-india": [
    { label: "Selling", options: ["Fashion", "Home and kitchen", "Beauty", "Handmade", "Electronics"] },
    { label: "Channel", options: ["WhatsApp and Instagram", "Marketplace", "Own website", "ONDC"] },
  ],
  "how-to-calculate-cash-runway-for-a-small-business-in-india": [
    { label: "Money owed to me", options: ["None", "Some udhaar", "A lot of udhaar"] },
    { label: "Each month I", options: ["Earn more than I spend", "Break even", "Lose money"] },
  ],
  "how-to-calculate-customer-lifetime-value-for-a-small-business-in-india": [
    { label: "Customers buy", options: ["Daily", "Weekly", "Monthly", "A few times a year"] },
    { label: "Customers stay", options: ["Under 3 months", "3–12 months", "Over a year"] },
  ],
  "how-to-keep-customers-coming-back-to-your-small-business-in-india": [
    { label: "Main reason customers leave", options: ["Late or wrong orders", "Price", "Quality", "Not sure"] },
    { label: "I stay in touch by", options: ["Nothing yet", "WhatsApp", "Calls", "Instagram"] },
  ],
  "when-to-raise-funds-for-a-startup-in-india": [
    { label: "Cash left", options: ["Under 3 months", "3–6 months", "Over 6 months"] },
    { label: "Paying customers", options: ["None", "Under 10", "10–100", "More than 100"] },
  ],
};
