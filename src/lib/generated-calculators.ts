import {
  formatRupees,
  formatCount,
  formatMonths,
  formatPercent,
  type Calculator,
} from "./calculators";

export const GENERATED_CALCULATORS: readonly Calculator[] = [
  {
    slug: "customer-acquisition-cost",
    title: "Customer Acquisition Cost",
    highlight: "(CAC)",
    answers: "How much you spend to acquire a single paying customer.",
    intro:
      "Understand your fundamental growth engine cost. If it costs more to acquire a customer than they pay you, growth kills the business.",
    description: "Calculate CAC based on sales and marketing spend.",
    seoKeywords: [
      "customer acquisition cost calculator",
      "cac calculator startup",
      "unit economics cac",
    ],
    fields: [
      {
        key: "marketingSpend",
        label: "Marketing spend",
        group: "Acquisition Costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Total ad spend, software, and marketing agency costs.",
        min: 0,
        max: 1000000000,
        step: 1000,
        defaultValue: 150000,
      },
      {
        key: "salesSpend",
        label: "Sales spend",
        group: "Acquisition Costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Salaries and commissions for the sales team.",
        min: 0,
        max: 1000000000,
        step: 1000,
        defaultValue: 250000,
      },
      {
        key: "newCustomers",
        label: "New customers acquired",
        group: "Results",
        unitLabel: "users",
        help: "Number of paying customers acquired in the same period.",
        min: 1,
        max: 10000000,
        step: 1,
        defaultValue: 100,
      },
    ],
    compute: (values) => {
      const totalCost = values.marketingSpend + values.salesSpend;
      const cac = totalCost / values.newCustomers;
      return [
        {
          key: "cac",
          label: "CAC",
          display: formatRupees(cac),
          formula: `${formatRupees(values.marketingSpend)} + ${formatRupees(values.salesSpend)} / ${formatCount(values.newCustomers)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      const cac = (values.marketingSpend + values.salesSpend) / values.newCustomers;
      return {
        header: "BBI Growth Assessment",
        tips: [
          `Your current blended CAC is ${formatRupees(cac)}. In isolation, this means nothing until compared with Lifetime Value (LTV).`,
          `If your customer pays less than ${formatRupees(cac)} in gross margin over their lifetime, you are losing money on every sale.`,
          "Focus on reducing sales cycle friction or increasing organic acquisition to drive this number down.",
        ],
      };
    },
  },
  {
    slug: "lifetime-value-ltv",
    title: "Lifetime Value (LTV)",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Lifetime Value (LTV) for your business.",
    intro:
      "Detailed breakdown of Lifetime Value (LTV) and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Lifetime Value (LTV) easily with this tool.",
    seoKeywords: [
      "lifetime value (ltv) calculator",
      "startup marketing & growth calculator",
      "unit economics lifetime value (ltv)",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 50000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 100,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Lifetime Value (LTV)",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Lifetime Value (LTV)",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "ltv-cac-ratio",
    title: "LTV:CAC Ratio",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate LTV:CAC Ratio for your business.",
    intro:
      "Detailed breakdown of LTV:CAC Ratio and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your LTV:CAC Ratio easily with this tool.",
    seoKeywords: [
      "ltv:cac ratio calculator",
      "startup saas metrics calculator",
      "unit economics ltv:cac ratio",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 51000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 101,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "LTV:CAC Ratio",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: LTV:CAC Ratio",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "payback-period",
    title: "Payback Period",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Payback Period for your business.",
    intro: "Detailed breakdown of Payback Period and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Payback Period easily with this tool.",
    seoKeywords: [
      "payback period calculator",
      "startup e-commerce calculator",
      "unit economics payback period",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 52000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 102,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Payback Period",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Payback Period",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "gross-margin",
    title: "Gross Margin",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Gross Margin for your business.",
    intro: "Detailed breakdown of Gross Margin and how to optimize it for Financing efficiency.",
    description: "Calculate your Gross Margin easily with this tool.",
    seoKeywords: [
      "gross margin calculator",
      "startup financing calculator",
      "unit economics gross margin",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 53000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 103,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Gross Margin",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Gross Margin",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "net-margin",
    title: "Net Margin",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Net Margin for your business.",
    intro: "Detailed breakdown of Net Margin and how to optimize it for Operations efficiency.",
    description: "Calculate your Net Margin easily with this tool.",
    seoKeywords: [
      "net margin calculator",
      "startup operations calculator",
      "unit economics net margin",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 54000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 104,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Net Margin",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Net Margin",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "arpu",
    title: "ARPU",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate ARPU for your business.",
    intro: "Detailed breakdown of ARPU and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your ARPU easily with this tool.",
    seoKeywords: [
      "arpu calculator",
      "startup marketing & growth calculator",
      "unit economics arpu",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 55000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 105,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "ARPU",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: ARPU",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "churn-rate",
    title: "Churn Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Churn Rate for your business.",
    intro: "Detailed breakdown of Churn Rate and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Churn Rate easily with this tool.",
    seoKeywords: [
      "churn rate calculator",
      "startup saas metrics calculator",
      "unit economics churn rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 56000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 106,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Churn Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Churn Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "net-revenue-retention",
    title: "Net Revenue Retention",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Net Revenue Retention for your business.",
    intro:
      "Detailed breakdown of Net Revenue Retention and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Net Revenue Retention easily with this tool.",
    seoKeywords: [
      "net revenue retention calculator",
      "startup e-commerce calculator",
      "unit economics net revenue retention",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 57000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 107,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Net Revenue Retention",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Net Revenue Retention",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "burn-rate",
    title: "Burn Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Burn Rate for your business.",
    intro: "Detailed breakdown of Burn Rate and how to optimize it for Financing efficiency.",
    description: "Calculate your Burn Rate easily with this tool.",
    seoKeywords: [
      "burn rate calculator",
      "startup financing calculator",
      "unit economics burn rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 58000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 108,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Burn Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Burn Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "runway",
    title: "Runway",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Runway for your business.",
    intro: "Detailed breakdown of Runway and how to optimize it for Operations efficiency.",
    description: "Calculate your Runway easily with this tool.",
    seoKeywords: ["runway calculator", "startup operations calculator", "unit economics runway"],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 59000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 109,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Runway",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Runway",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "rule-of-40",
    title: "Rule of 40",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Rule of 40 for your business.",
    intro:
      "Detailed breakdown of Rule of 40 and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Rule of 40 easily with this tool.",
    seoKeywords: [
      "rule of 40 calculator",
      "startup marketing & growth calculator",
      "unit economics rule of 40",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 60000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 110,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Rule of 40",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Rule of 40",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "magic-number",
    title: "Magic Number",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Magic Number for your business.",
    intro: "Detailed breakdown of Magic Number and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Magic Number easily with this tool.",
    seoKeywords: [
      "magic number calculator",
      "startup saas metrics calculator",
      "unit economics magic number",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 61000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 111,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Magic Number",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Magic Number",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "quick-ratio",
    title: "Quick Ratio",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Quick Ratio for your business.",
    intro: "Detailed breakdown of Quick Ratio and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Quick Ratio easily with this tool.",
    seoKeywords: [
      "quick ratio calculator",
      "startup e-commerce calculator",
      "unit economics quick ratio",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 62000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 112,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Quick Ratio",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Quick Ratio",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "lead-velocity-rate",
    title: "Lead Velocity Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Lead Velocity Rate for your business.",
    intro:
      "Detailed breakdown of Lead Velocity Rate and how to optimize it for Financing efficiency.",
    description: "Calculate your Lead Velocity Rate easily with this tool.",
    seoKeywords: [
      "lead velocity rate calculator",
      "startup financing calculator",
      "unit economics lead velocity rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 63000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 113,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Lead Velocity Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Lead Velocity Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "conversion-rate",
    title: "Conversion Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Conversion Rate for your business.",
    intro:
      "Detailed breakdown of Conversion Rate and how to optimize it for Operations efficiency.",
    description: "Calculate your Conversion Rate easily with this tool.",
    seoKeywords: [
      "conversion rate calculator",
      "startup operations calculator",
      "unit economics conversion rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 64000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 114,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Conversion Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Conversion Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "roas",
    title: "ROAS",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate ROAS for your business.",
    intro: "Detailed breakdown of ROAS and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your ROAS easily with this tool.",
    seoKeywords: [
      "roas calculator",
      "startup marketing & growth calculator",
      "unit economics roas",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 65000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 115,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "ROAS",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: ROAS",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "bounce-rate",
    title: "Bounce Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Bounce Rate for your business.",
    intro: "Detailed breakdown of Bounce Rate and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Bounce Rate easily with this tool.",
    seoKeywords: [
      "bounce rate calculator",
      "startup saas metrics calculator",
      "unit economics bounce rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 66000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 116,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Bounce Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Bounce Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "aov",
    title: "AOV",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate AOV for your business.",
    intro: "Detailed breakdown of AOV and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your AOV easily with this tool.",
    seoKeywords: ["aov calculator", "startup e-commerce calculator", "unit economics aov"],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 67000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 117,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "AOV",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: AOV",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "cart-abandonment-rate",
    title: "Cart Abandonment Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Cart Abandonment Rate for your business.",
    intro:
      "Detailed breakdown of Cart Abandonment Rate and how to optimize it for Financing efficiency.",
    description: "Calculate your Cart Abandonment Rate easily with this tool.",
    seoKeywords: [
      "cart abandonment rate calculator",
      "startup financing calculator",
      "unit economics cart abandonment rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 68000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 118,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Cart Abandonment Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Cart Abandonment Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "inventory-turnover",
    title: "Inventory Turnover",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Inventory Turnover for your business.",
    intro:
      "Detailed breakdown of Inventory Turnover and how to optimize it for Operations efficiency.",
    description: "Calculate your Inventory Turnover easily with this tool.",
    seoKeywords: [
      "inventory turnover calculator",
      "startup operations calculator",
      "unit economics inventory turnover",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 69000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 119,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Inventory Turnover",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Inventory Turnover",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "working-capital",
    title: "Working Capital",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Working Capital for your business.",
    intro:
      "Detailed breakdown of Working Capital and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Working Capital easily with this tool.",
    seoKeywords: [
      "working capital calculator",
      "startup marketing & growth calculator",
      "unit economics working capital",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 70000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 120,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Working Capital",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Working Capital",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "ebitda",
    title: "EBITDA",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate EBITDA for your business.",
    intro: "Detailed breakdown of EBITDA and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your EBITDA easily with this tool.",
    seoKeywords: ["ebitda calculator", "startup saas metrics calculator", "unit economics ebitda"],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 71000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 121,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "EBITDA",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: EBITDA",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "pre-money-valuation",
    title: "Pre-Money Valuation",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Pre-Money Valuation for your business.",
    intro:
      "Detailed breakdown of Pre-Money Valuation and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Pre-Money Valuation easily with this tool.",
    seoKeywords: [
      "pre-money valuation calculator",
      "startup e-commerce calculator",
      "unit economics pre-money valuation",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 72000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 122,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Pre-Money Valuation",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Pre-Money Valuation",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "post-money-dilution",
    title: "Post-Money Dilution",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Post-Money Dilution for your business.",
    intro:
      "Detailed breakdown of Post-Money Dilution and how to optimize it for Financing efficiency.",
    description: "Calculate your Post-Money Dilution easily with this tool.",
    seoKeywords: [
      "post-money dilution calculator",
      "startup financing calculator",
      "unit economics post-money dilution",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 73000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 123,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Post-Money Dilution",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Post-Money Dilution",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "option-pool-sizing",
    title: "Option Pool Sizing",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Option Pool Sizing for your business.",
    intro:
      "Detailed breakdown of Option Pool Sizing and how to optimize it for Operations efficiency.",
    description: "Calculate your Option Pool Sizing easily with this tool.",
    seoKeywords: [
      "option pool sizing calculator",
      "startup operations calculator",
      "unit economics option pool sizing",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 74000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 124,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Option Pool Sizing",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Option Pool Sizing",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "tam-sam-som",
    title: "TAM / SAM / SOM",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate TAM / SAM / SOM for your business.",
    intro:
      "Detailed breakdown of TAM / SAM / SOM and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your TAM / SAM / SOM easily with this tool.",
    seoKeywords: [
      "tam / sam / som calculator",
      "startup marketing & growth calculator",
      "unit economics tam / sam / som",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 75000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 125,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "TAM / SAM / SOM",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: TAM / SAM / SOM",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "market-share",
    title: "Market Share",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Market Share for your business.",
    intro: "Detailed breakdown of Market Share and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Market Share easily with this tool.",
    seoKeywords: [
      "market share calculator",
      "startup saas metrics calculator",
      "unit economics market share",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 76000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 126,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Market Share",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Market Share",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "gross-merchandise-value",
    title: "Gross Merchandise Value",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Gross Merchandise Value for your business.",
    intro:
      "Detailed breakdown of Gross Merchandise Value and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Gross Merchandise Value easily with this tool.",
    seoKeywords: [
      "gross merchandise value calculator",
      "startup e-commerce calculator",
      "unit economics gross merchandise value",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 77000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 127,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Gross Merchandise Value",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Gross Merchandise Value",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "take-rate",
    title: "Take Rate",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Take Rate for your business.",
    intro: "Detailed breakdown of Take Rate and how to optimize it for Financing efficiency.",
    description: "Calculate your Take Rate easily with this tool.",
    seoKeywords: [
      "take rate calculator",
      "startup financing calculator",
      "unit economics take rate",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 78000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 128,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Take Rate",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Take Rate",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "cash-conversion-cycle",
    title: "Cash Conversion Cycle",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Cash Conversion Cycle for your business.",
    intro:
      "Detailed breakdown of Cash Conversion Cycle and how to optimize it for Operations efficiency.",
    description: "Calculate your Cash Conversion Cycle easily with this tool.",
    seoKeywords: [
      "cash conversion cycle calculator",
      "startup operations calculator",
      "unit economics cash conversion cycle",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 79000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 129,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Cash Conversion Cycle",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Cash Conversion Cycle",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "debt-to-equity",
    title: "Debt-to-Equity",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Debt-to-Equity for your business.",
    intro:
      "Detailed breakdown of Debt-to-Equity and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Debt-to-Equity easily with this tool.",
    seoKeywords: [
      "debt-to-equity calculator",
      "startup marketing & growth calculator",
      "unit economics debt-to-equity",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 80000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 130,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Debt-to-Equity",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Debt-to-Equity",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "interest-coverage",
    title: "Interest Coverage",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Interest Coverage for your business.",
    intro:
      "Detailed breakdown of Interest Coverage and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Interest Coverage easily with this tool.",
    seoKeywords: [
      "interest coverage calculator",
      "startup saas metrics calculator",
      "unit economics interest coverage",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 81000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 131,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Interest Coverage",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Interest Coverage",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "operating-leverage",
    title: "Operating Leverage",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Operating Leverage for your business.",
    intro:
      "Detailed breakdown of Operating Leverage and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Operating Leverage easily with this tool.",
    seoKeywords: [
      "operating leverage calculator",
      "startup e-commerce calculator",
      "unit economics operating leverage",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 82000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 132,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Operating Leverage",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Operating Leverage",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "customer-profitability",
    title: "Customer Profitability",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Customer Profitability for your business.",
    intro:
      "Detailed breakdown of Customer Profitability and how to optimize it for Financing efficiency.",
    description: "Calculate your Customer Profitability easily with this tool.",
    seoKeywords: [
      "customer profitability calculator",
      "startup financing calculator",
      "unit economics customer profitability",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 83000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 133,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Customer Profitability",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Customer Profitability",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "sales-pipeline-velocity",
    title: "Sales Pipeline Velocity",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Sales Pipeline Velocity for your business.",
    intro:
      "Detailed breakdown of Sales Pipeline Velocity and how to optimize it for Operations efficiency.",
    description: "Calculate your Sales Pipeline Velocity easily with this tool.",
    seoKeywords: [
      "sales pipeline velocity calculator",
      "startup operations calculator",
      "unit economics sales pipeline velocity",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 84000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 134,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Sales Pipeline Velocity",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Sales Pipeline Velocity",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "cost-of-goods-sold-cogs",
    title: "Cost of Goods Sold (COGS)",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Cost of Goods Sold (COGS) for your business.",
    intro:
      "Detailed breakdown of Cost of Goods Sold (COGS) and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Cost of Goods Sold (COGS) easily with this tool.",
    seoKeywords: [
      "cost of goods sold (cogs) calculator",
      "startup marketing & growth calculator",
      "unit economics cost of goods sold (cogs)",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 85000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 135,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Cost of Goods Sold (COGS)",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Cost of Goods Sold (COGS)",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "contribution-margin",
    title: "Contribution Margin",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Contribution Margin for your business.",
    intro:
      "Detailed breakdown of Contribution Margin and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Contribution Margin easily with this tool.",
    seoKeywords: [
      "contribution margin calculator",
      "startup saas metrics calculator",
      "unit economics contribution margin",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 86000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 136,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Contribution Margin",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Contribution Margin",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "breakeven-volume",
    title: "Breakeven Volume",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Breakeven Volume for your business.",
    intro:
      "Detailed breakdown of Breakeven Volume and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Breakeven Volume easily with this tool.",
    seoKeywords: [
      "breakeven volume calculator",
      "startup e-commerce calculator",
      "unit economics breakeven volume",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 87000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 137,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Breakeven Volume",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Breakeven Volume",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "target-profit-pricing",
    title: "Target Profit Pricing",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Target Profit Pricing for your business.",
    intro:
      "Detailed breakdown of Target Profit Pricing and how to optimize it for Financing efficiency.",
    description: "Calculate your Target Profit Pricing easily with this tool.",
    seoKeywords: [
      "target profit pricing calculator",
      "startup financing calculator",
      "unit economics target profit pricing",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 88000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 138,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Target Profit Pricing",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Target Profit Pricing",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "markup-percentage",
    title: "Markup Percentage",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Markup Percentage for your business.",
    intro:
      "Detailed breakdown of Markup Percentage and how to optimize it for Operations efficiency.",
    description: "Calculate your Markup Percentage easily with this tool.",
    seoKeywords: [
      "markup percentage calculator",
      "startup operations calculator",
      "unit economics markup percentage",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 89000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 139,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Markup Percentage",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Markup Percentage",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "employee-turnover-cost",
    title: "Employee Turnover Cost",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Employee Turnover Cost for your business.",
    intro:
      "Detailed breakdown of Employee Turnover Cost and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Employee Turnover Cost easily with this tool.",
    seoKeywords: [
      "employee turnover cost calculator",
      "startup marketing & growth calculator",
      "unit economics employee turnover cost",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 90000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 140,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Employee Turnover Cost",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Employee Turnover Cost",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "revenue-per-employee",
    title: "Revenue Per Employee",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Revenue Per Employee for your business.",
    intro:
      "Detailed breakdown of Revenue Per Employee and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Revenue Per Employee easily with this tool.",
    seoKeywords: [
      "revenue per employee calculator",
      "startup saas metrics calculator",
      "unit economics revenue per employee",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 91000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 141,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Revenue Per Employee",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Revenue Per Employee",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "saas-gross-margin",
    title: "SaaS Gross Margin",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate SaaS Gross Margin for your business.",
    intro:
      "Detailed breakdown of SaaS Gross Margin and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your SaaS Gross Margin easily with this tool.",
    seoKeywords: [
      "saas gross margin calculator",
      "startup e-commerce calculator",
      "unit economics saas gross margin",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 92000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 142,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "SaaS Gross Margin",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: SaaS Gross Margin",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "cac-payback-period",
    title: "CAC Payback Period",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate CAC Payback Period for your business.",
    intro:
      "Detailed breakdown of CAC Payback Period and how to optimize it for Financing efficiency.",
    description: "Calculate your CAC Payback Period easily with this tool.",
    seoKeywords: [
      "cac payback period calculator",
      "startup financing calculator",
      "unit economics cac payback period",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 93000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 143,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "CAC Payback Period",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: CAC Payback Period",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "expansion-revenue-impact",
    title: "Expansion Revenue Impact",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Expansion Revenue Impact for your business.",
    intro:
      "Detailed breakdown of Expansion Revenue Impact and how to optimize it for Operations efficiency.",
    description: "Calculate your Expansion Revenue Impact easily with this tool.",
    seoKeywords: [
      "expansion revenue impact calculator",
      "startup operations calculator",
      "unit economics expansion revenue impact",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 94000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 144,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Expansion Revenue Impact",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Expansion Revenue Impact",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "viral-coefficient-k-factor",
    title: "Viral Coefficient (K-Factor)",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Viral Coefficient (K-Factor) for your business.",
    intro:
      "Detailed breakdown of Viral Coefficient (K-Factor) and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Viral Coefficient (K-Factor) easily with this tool.",
    seoKeywords: [
      "viral coefficient (k-factor) calculator",
      "startup marketing & growth calculator",
      "unit economics viral coefficient (k-factor)",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 95000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 145,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Viral Coefficient (K-Factor)",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Viral Coefficient (K-Factor)",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "nps-roi",
    title: "NPS ROI",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate NPS ROI for your business.",
    intro: "Detailed breakdown of NPS ROI and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your NPS ROI easily with this tool.",
    seoKeywords: [
      "nps roi calculator",
      "startup saas metrics calculator",
      "unit economics nps roi",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 96000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 146,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "NPS ROI",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: NPS ROI",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "support-ticket-cost",
    title: "Support Ticket Cost",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Support Ticket Cost for your business.",
    intro:
      "Detailed breakdown of Support Ticket Cost and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Support Ticket Cost easily with this tool.",
    seoKeywords: [
      "support ticket cost calculator",
      "startup e-commerce calculator",
      "unit economics support ticket cost",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 97000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 147,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Support Ticket Cost",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Support Ticket Cost",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "server-cost-per-user",
    title: "Server Cost Per User",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Server Cost Per User for your business.",
    intro:
      "Detailed breakdown of Server Cost Per User and how to optimize it for Financing efficiency.",
    description: "Calculate your Server Cost Per User easily with this tool.",
    seoKeywords: [
      "server cost per user calculator",
      "startup financing calculator",
      "unit economics server cost per user",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 98000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 148,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Server Cost Per User",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Server Cost Per User",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "api-call-profitability",
    title: "API Call Profitability",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate API Call Profitability for your business.",
    intro:
      "Detailed breakdown of API Call Profitability and how to optimize it for Operations efficiency.",
    description: "Calculate your API Call Profitability easily with this tool.",
    seoKeywords: [
      "api call profitability calculator",
      "startup operations calculator",
      "unit economics api call profitability",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 99000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 149,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "API Call Profitability",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: API Call Profitability",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "subscription-downgrade-impact",
    title: "Subscription Downgrade Impact",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Subscription Downgrade Impact for your business.",
    intro:
      "Detailed breakdown of Subscription Downgrade Impact and how to optimize it for Marketing & Growth efficiency.",
    description: "Calculate your Subscription Downgrade Impact easily with this tool.",
    seoKeywords: [
      "subscription downgrade impact calculator",
      "startup marketing & growth calculator",
      "unit economics subscription downgrade impact",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 100000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 150,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Subscription Downgrade Impact",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Subscription Downgrade Impact",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "pricing-tier-break-even",
    title: "Pricing Tier Break-even",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Pricing Tier Break-even for your business.",
    intro:
      "Detailed breakdown of Pricing Tier Break-even and how to optimize it for SaaS Metrics efficiency.",
    description: "Calculate your Pricing Tier Break-even easily with this tool.",
    seoKeywords: [
      "pricing tier break-even calculator",
      "startup saas metrics calculator",
      "unit economics pricing tier break-even",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 101000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 151,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Pricing Tier Break-even",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Pricing Tier Break-even",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "freemium-conversion-value",
    title: "Freemium Conversion Value",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Freemium Conversion Value for your business.",
    intro:
      "Detailed breakdown of Freemium Conversion Value and how to optimize it for E-Commerce efficiency.",
    description: "Calculate your Freemium Conversion Value easily with this tool.",
    seoKeywords: [
      "freemium conversion value calculator",
      "startup e-commerce calculator",
      "unit economics freemium conversion value",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 102000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 152,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Freemium Conversion Value",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Freemium Conversion Value",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "discounting-impact",
    title: "Discounting Impact",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Discounting Impact for your business.",
    intro:
      "Detailed breakdown of Discounting Impact and how to optimize it for Financing efficiency.",
    description: "Calculate your Discounting Impact easily with this tool.",
    seoKeywords: [
      "discounting impact calculator",
      "startup financing calculator",
      "unit economics discounting impact",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 103000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 153,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Discounting Impact",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Discounting Impact",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
  {
    slug: "sales-commission-roi",
    title: "Sales Commission ROI",
    highlight: "Analyzer",
    answers: "A strategic tool to calculate Sales Commission ROI for your business.",
    intro:
      "Detailed breakdown of Sales Commission ROI and how to optimize it for Operations efficiency.",
    description: "Calculate your Sales Commission ROI easily with this tool.",
    seoKeywords: [
      "sales commission roi calculator",
      "startup operations calculator",
      "unit economics sales commission roi",
    ],
    fields: [
      {
        key: "inputA",
        label: "Primary Revenue/Cost",
        group: "Variables",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The primary financial input.",
        min: 0,
        max: 10000000,
        step: 1000,
        defaultValue: 104000,
      },
      {
        key: "inputB",
        label: "Volume/Users",
        group: "Variables",
        unitLabel: "units",
        help: "The secondary factor.",
        min: 1,
        max: 100000,
        step: 1,
        defaultValue: 154,
      },
    ],
    compute: (values) => {
      const result = values.inputA / values.inputB;
      return [
        {
          key: "res",
          label: "Sales Commission ROI",
          display: formatRupees(result),
          formula: `${formatRupees(values.inputA)} / ${formatCount(values.inputB)}`,
          status: "ok",
          primary: true,
        },
      ];
    },
    mentorAnalysis: (values, readings) => {
      return {
        header: "Strategic Insight: Sales Commission ROI",
        tips: [
          "This metric heavily impacts your capital efficiency.",
          "Consider optimizing your volume to leverage fixed costs and improve margins.",
          "Tracking this monthly prevents unexpected cash flow gaps and validates your business model.",
        ],
      };
    },
  },
];
