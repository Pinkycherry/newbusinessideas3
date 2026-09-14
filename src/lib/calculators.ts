/**
 * SINGLE SOURCE OF TRUTH for the calculator template (brief section 6.8).
 *
 * Every calculator on the site is one entry in `CALCULATORS` below. The two
 * routes (`/calculator` and `/calculator/$slug`) read this file and render
 * whatever they find — they contain no arithmetic and no per-calculator
 * branching. Adding another calculator means adding one object to that array
 * and nothing else: no new route file, no new component, no rebuild of the
 * index page, no schema or breadcrumb work.
 *
 * The maths lives in exported pure functions (`breakEven`, `startupCost`,
 * `roi`, `fundingNeeded`, `runway`, `acquisitionCost`, `lifetimeValue`,
 * `marketSize`). They take plain numbers, return plain data, touch no browser
 * API, and can be called straight from a test or a script.
 *
 * Two rules the numbers here are held to:
 *
 * 1. Nothing is invented. A calculator reports what the visitor typed and the
 *    arithmetic done to it. There are no industry averages, no "healthy"
 *    ranges, no typical costs, no benchmarks of any kind.
 * 2. Nothing is ever `NaN`, `Infinity` or blank. Dividing by zero, a negative
 *    entry, and a business that never breaks even are all real answers, and
 *    each one is given a name and a sentence explaining it.
 */

// ---------------------------------------------------------------------------
// Formatting — Indian digit grouping everywhere
// ---------------------------------------------------------------------------

/**
 * India groups digits as 1,00,000 (one lakh), not 100,000. `en-IN` is the only
 * thing that gets this right, so every number shown to a visitor goes through
 * one of the formatters below rather than through `toLocaleString()` or string
 * maths at the call site.
 */
const RUPEES_WHOLE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const RUPEES_PAISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COUNT = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const ONE_DECIMAL = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** "₹1,00,000" — whole rupees by default, paise when a unit price needs them. */
export function formatRupees(value: number, paise = false): string {
  if (!Number.isFinite(value)) return "Not a number";
  return paise ? RUPEES_PAISE.format(value) : RUPEES_WHOLE.format(value);
}

/** "1,00,000" — a plain count with Indian grouping. */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "Not a number";
  return COUNT.format(value);
}

/** "784 units" / "1 unit". */
export function formatUnits(value: number): string {
  return `${formatCount(value)} ${value === 1 ? "unit" : "units"}`;
}

/** "2.6 months" / "1.0 month". */
export function formatMonths(value: number): string {
  if (!Number.isFinite(value)) return "Not a number";
  const rounded = Math.round(value * 10) / 10;
  return `${ONE_DECIMAL.format(rounded)} ${rounded === 1 ? "month" : "months"}`;
}

/** "144.0% a year". The sign is kept — a loss reads as a loss. */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "Not a number";
  return `${ONE_DECIMAL.format(value)}%`;
}

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

/** One typed input on a calculator. The route renders these; it never hardcodes one. */
export type CalculatorField = {
  readonly key: string;
  readonly label: string;
  /** Groups the field under a heading, e.g. "One-time costs". Order of first use wins. */
  readonly group: string;
  /** How the unit is spoken inside the label, e.g. "in rupees". Never blank. */
  readonly unitLabel: string;
  /** Sits before the number inside the input, e.g. "₹". */
  readonly prefix?: string;
  /** Sits after the number, e.g. "units / month". */
  readonly suffix?: string;
  /** One plain sentence saying what to type here. Always shown, never a tooltip. */
  readonly help: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly defaultValue: number;
};

export type ReadingStatus = "ok" | "blocked";

/**
 * One line of output. `display` is already formatted and ready to render, and
 * `formula` names the arithmetic in words with the visitor's own numbers in
 * it, because a founder should be able to check the answer by hand.
 */
export type Reading = {
  readonly key: string;
  readonly label: string;
  readonly display: string;
  readonly formula: string;
  /** Why the answer is what it is. Always present on a blocked reading. */
  readonly note?: string;
  readonly status: ReadingStatus;
  /** The one answer the calculator exists to give. At most one per calculator. */
  readonly primary?: boolean;
};

export type CalculatorValues = Readonly<Record<string, number>>;

export type Calculator = {
  readonly slug: string;
  /** H1, first half. */
  readonly title: string;
  /** H1, second half — rendered in the gradient the rest of the site uses. */
  readonly highlight: string;
  /** One line on the index page: the question this tool answers. */
  readonly answers: string;
  /** The paragraph under the H1. */
  readonly intro: string;
  /** Meta description. */
  readonly description: string;
  readonly fields: readonly CalculatorField[];
  readonly compute: (values: CalculatorValues) => readonly Reading[];
};

// ---------------------------------------------------------------------------
// Reading the inputs
// ---------------------------------------------------------------------------

export type FieldIssue = {
  readonly key: string;
  readonly label: string;
  readonly message: string;
};

/**
 * Turns what was typed into a number. Commas, spaces and a rupee sign are
 * stripped first, so pasting "₹1,00,000" straight off a bank statement works.
 * Returns NaN for anything that is not a number — the caller names it.
 */
export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[₹,\s_]/g, "");
  if (cleaned === "") return Number.NaN;
  return Number(cleaned);
}

/** Formats a bound in the same shape as the field it belongs to. */
function describeBound(field: CalculatorField, value: number): string {
  if (field.prefix === "₹") return formatRupees(value);
  const suffix = field.suffix ? ` ${field.suffix}` : "";
  return `${formatCount(value)}${suffix}`;
}

/** Returns the one thing wrong with this field, or null when it is fine. */
export function checkField(field: CalculatorField, raw: string): FieldIssue | null {
  const at = (message: string): FieldIssue => ({ key: field.key, label: field.label, message });
  const trimmed = raw.trim();
  if (trimmed === "") return at("This is empty. Type a number to see the result.");

  const value = parseAmount(raw);
  if (Number.isNaN(value)) return at("This is not a number. Use digits only.");
  if (!Number.isFinite(value)) return at("This number is too large to work with.");
  if (value < 0) return at("This cannot be less than zero. Money and counts do not go negative.");
  if (value < field.min)
    return at(`The smallest this tool takes is ${describeBound(field, field.min)}.`);
  if (value > field.max)
    return at(`The largest this tool takes is ${describeBound(field, field.max)}.`);
  return null;
}

/**
 * Reads a whole form. `values` is only trustworthy when `issues` is empty —
 * the route shows the issues instead of a number in that case, so a bad entry
 * never reaches the arithmetic.
 */
export function readValues(
  fields: readonly CalculatorField[],
  raw: Readonly<Record<string, string>>,
): { values: CalculatorValues; issues: readonly FieldIssue[] } {
  const values: Record<string, number> = {};
  const issues: FieldIssue[] = [];
  for (const field of fields) {
    const typed = raw[field.key] ?? "";
    const issue = checkField(field, typed);
    if (issue) {
      issues.push(issue);
      values[field.key] = field.defaultValue;
    } else {
      values[field.key] = parseAmount(typed);
    }
  }
  return { values, issues };
}

/** Every field's default, as the strings the inputs start out holding. */
export function defaultInputs(calculator: Calculator): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of calculator.fields) out[field.key] = String(field.defaultValue);
  return out;
}

/** Field keys in order, grouped under their heading. */
export function fieldGroups(
  calculator: Calculator,
): readonly { group: string; fields: readonly CalculatorField[] }[] {
  const order: string[] = [];
  const bucket = new Map<string, CalculatorField[]>();
  for (const field of calculator.fields) {
    const existing = bucket.get(field.group);
    if (existing) {
      existing.push(field);
    } else {
      order.push(field.group);
      bucket.set(field.group, [field]);
    }
  }
  return order.map((group) => ({ group, fields: bucket.get(group) ?? [] }));
}

/** Reads one key out of a values bag. Missing means zero, never undefined. */
function at(values: CalculatorValues, key: string): number {
  return values[key] ?? 0;
}

// ---------------------------------------------------------------------------
// 1. Break-even
// ---------------------------------------------------------------------------

export type BreakEvenInput = {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  unitsSoldPerMonth: number;
};

export function breakEven(input: BreakEvenInput): readonly Reading[] {
  const { fixedCosts, pricePerUnit, variableCostPerUnit, unitsSoldPerMonth } = input;
  const perUnit = pricePerUnit - variableCostPerUnit;

  const perUnitReading: Reading = {
    key: "per-unit",
    label: "What one sale leaves you",
    display: formatRupees(perUnit, true),
    formula: `Price minus variable cost. ${formatRupees(pricePerUnit, true)} minus ${formatRupees(variableCostPerUnit, true)} is ${formatRupees(perUnit, true)}.`,
    status: "ok",
  };

  // Never breaks even. This is a real outcome, not an error, so it is named
  // and explained rather than shown as Infinity or hidden behind a blank.
  if (perUnit <= 0) {
    const why =
      perUnit === 0
        ? `Your price is exactly your variable cost, so a sale leaves you nothing towards the ${formatRupees(fixedCosts)} of fixed costs.`
        : `Each unit costs ${formatRupees(Math.abs(perUnit), true)} more to make and deliver than you charge for it, so selling more loses more.`;
    const never = "Never at this price";
    return [
      {
        key: "units",
        label: "Units to break even",
        display: never,
        formula:
          "Fixed costs divided by what one sale leaves you — which here is zero or less, so there is nothing to divide by.",
        note: `${why} No number of units covers the fixed costs. Raise the price or bring the variable cost down.`,
        status: "blocked",
        primary: true,
      },
      {
        key: "revenue",
        label: "Sales value at break-even",
        display: never,
        formula: "Units to break even multiplied by price.",
        note: "There is no break-even point to price up.",
        status: "blocked",
      },
      {
        key: "months",
        label: "Months to break even",
        display: never,
        formula: "Units to break even divided by units sold each month.",
        note: "There is no break-even point to reach, however long you sell for.",
        status: "blocked",
      },
      perUnitReading,
    ];
  }

  // Units are whole things, so a part-unit is rounded up: you do not break
  // even until the unit that crosses the line is actually sold.
  const units = Math.ceil(fixedCosts / perUnit);
  const revenue = units * pricePerUnit;

  const unitsReading: Reading = {
    key: "units",
    label: "Units to break even",
    display: formatUnits(units),
    formula: `Fixed costs divided by what one sale leaves you. ${formatRupees(fixedCosts)} divided by ${formatRupees(perUnit, true)} is ${formatUnits(units)}, rounded up to a whole unit.`,
    status: "ok",
    primary: true,
    ...(fixedCosts === 0
      ? { note: "You entered no fixed costs, so there is nothing to cover before the first sale." }
      : {}),
  };

  const revenueReading: Reading = {
    key: "revenue",
    label: "Sales value at break-even",
    display: formatRupees(revenue),
    formula: `Units to break even multiplied by price. ${formatUnits(units)} at ${formatRupees(pricePerUnit, true)} is ${formatRupees(revenue)}.`,
    status: "ok",
  };

  const monthsReading: Reading =
    unitsSoldPerMonth <= 0
      ? {
          key: "months",
          label: "Months to break even",
          display: "No timeline yet",
          formula: "Units to break even divided by units sold each month.",
          note: "You have entered zero sales a month, so there is nothing to divide by. Put in how many units you expect to sell in a month and this fills in.",
          status: "blocked",
        }
      : {
          key: "months",
          label: "Months to break even",
          display: formatMonths(units / unitsSoldPerMonth),
          formula: `Units to break even divided by units sold each month. ${formatUnits(units)} divided by ${formatCount(unitsSoldPerMonth)} a month is ${formatMonths(units / unitsSoldPerMonth)}.`,
          note: "This uses the monthly sales figure you typed in. It is your estimate, not ours.",
          status: "ok",
        };

  return [unitsReading, revenueReading, monthsReading, perUnitReading];
}

// ---------------------------------------------------------------------------
// 2. Startup cost
// ---------------------------------------------------------------------------

export type StartupCostInput = {
  registration: number;
  equipment: number;
  deposit: number;
  openingStock: number;
  launchSpend: number;
  rent: number;
  salaries: number;
  marketing: number;
  otherMonthly: number;
  cashAvailable: number;
};

export function startupCost(input: StartupCostInput): readonly Reading[] {
  const oneTime =
    input.registration + input.equipment + input.deposit + input.openingStock + input.launchSpend;
  const monthly = input.rent + input.salaries + input.marketing + input.otherMonthly;
  const dayOne = oneTime + monthly;
  const leftOver = input.cashAvailable - oneTime;

  const oneTimeReading: Reading = {
    key: "one-time",
    label: "One-time cost to launch",
    display: formatRupees(oneTime),
    formula: `Registration ${formatRupees(input.registration)} plus equipment ${formatRupees(input.equipment)} plus deposit and fit-out ${formatRupees(input.deposit)} plus opening stock ${formatRupees(input.openingStock)} plus website and launch ${formatRupees(input.launchSpend)}.`,
    status: "ok",
    primary: true,
  };

  const monthlyReading: Reading = {
    key: "monthly",
    label: "Cost every month after that",
    display: formatRupees(monthly),
    formula: `Rent ${formatRupees(input.rent)} plus salaries ${formatRupees(input.salaries)} plus marketing ${formatRupees(input.marketing)} plus other running costs ${formatRupees(input.otherMonthly)}.`,
    status: "ok",
  };

  const dayOneReading: Reading = {
    key: "day-one",
    label: "Cash you need before month one ends",
    display: formatRupees(dayOne),
    formula: `One-time cost plus one month of running cost. ${formatRupees(oneTime)} plus ${formatRupees(monthly)} is ${formatRupees(dayOne)}.`,
    status: "ok",
  };

  let runwayReading: Reading;
  if (leftOver < 0) {
    runwayReading = {
      key: "runway",
      label: "Runway after launch",
      display: `Short by ${formatRupees(Math.abs(leftOver))}`,
      formula: `Cash you have minus one-time cost. ${formatRupees(input.cashAvailable)} minus ${formatRupees(oneTime)} is ${formatRupees(leftOver)}.`,
      note: "The one-time costs alone are more than the cash you have, so there is nothing left to run on. Close the gap before counting months.",
      status: "blocked",
    };
  } else if (monthly <= 0) {
    runwayReading = {
      key: "runway",
      label: "Runway after launch",
      display: "No monthly cost entered",
      formula: "Cash left after launch divided by monthly cost.",
      note: `You have ${formatRupees(leftOver)} left after launch and no monthly cost to spend it on, so there is nothing to divide by. Add your monthly costs and this fills in.`,
      status: "blocked",
    };
  } else {
    runwayReading = {
      key: "runway",
      label: "Runway after launch",
      display: formatMonths(leftOver / monthly),
      formula: `Cash left after launch divided by monthly cost. ${formatRupees(input.cashAvailable)} minus ${formatRupees(oneTime)} is ${formatRupees(leftOver)}, divided by ${formatRupees(monthly)} a month is ${formatMonths(leftOver / monthly)}.`,
      note: "This assumes no money comes in. Any revenue you earn stretches it further.",
      status: "ok",
    };
  }

  return [oneTimeReading, monthlyReading, dayOneReading, runwayReading];
}

// ---------------------------------------------------------------------------
// 3. ROI
// ---------------------------------------------------------------------------

export type RoiInput = {
  investment: number;
  monthlyRevenue: number;
  monthlyCost: number;
};

export function roi(input: RoiInput): readonly Reading[] {
  const { investment, monthlyRevenue, monthlyCost } = input;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const yearProfit = monthlyProfit * 12;

  const profitReading: Reading = {
    key: "monthly-profit",
    label: "Profit each month",
    display: formatRupees(monthlyProfit),
    formula: `Monthly revenue minus monthly cost. ${formatRupees(monthlyRevenue)} minus ${formatRupees(monthlyCost)} is ${formatRupees(monthlyProfit)}.`,
    status: "ok",
  };

  const yearReading: Reading = {
    key: "year-profit",
    label: "Profit over twelve months",
    display: formatRupees(yearProfit),
    formula: `Profit each month multiplied by twelve. ${formatRupees(monthlyProfit)} times 12 is ${formatRupees(yearProfit)}.`,
    status: "ok",
    note: "This holds your monthly figures steady for a year. Real months move.",
  };

  let paybackReading: Reading;
  if (monthlyProfit <= 0) {
    paybackReading = {
      key: "payback",
      label: "Payback period",
      display: "Never at these numbers",
      formula:
        "Investment divided by profit each month — which here is zero or less, so there is nothing to divide by.",
      note:
        monthlyProfit === 0
          ? `Revenue exactly matches cost, so no month puts anything back towards the ${formatRupees(investment)} you put in.`
          : `You are ${formatRupees(Math.abs(monthlyProfit))} down each month, so the money you put in never comes back. The gap has to close first.`,
      status: "blocked",
      primary: true,
    };
  } else if (investment <= 0) {
    paybackReading = {
      key: "payback",
      label: "Payback period",
      display: "Nothing to pay back",
      formula: "Investment divided by profit each month.",
      note: "You entered no investment, so there is nothing to earn back.",
      status: "ok",
      primary: true,
    };
  } else {
    paybackReading = {
      key: "payback",
      label: "Payback period",
      display: formatMonths(investment / monthlyProfit),
      formula: `Investment divided by profit each month. ${formatRupees(investment)} divided by ${formatRupees(monthlyProfit)} a month is ${formatMonths(investment / monthlyProfit)}.`,
      status: "ok",
      primary: true,
    };
  }

  const returnReading: Reading =
    investment <= 0
      ? {
          key: "annual-return",
          label: "Return over twelve months",
          display: "Cannot be worked out",
          formula: "Twelve months of profit divided by the investment, shown as a percentage.",
          note: "A return measures profit against the money put in. With nothing put in, there is nothing to measure it against.",
          status: "blocked",
        }
      : {
          key: "annual-return",
          label: "Return over twelve months",
          display: formatPercent((yearProfit / investment) * 100),
          formula: `Twelve months of profit divided by the investment. ${formatRupees(yearProfit)} divided by ${formatRupees(investment)} is ${formatPercent((yearProfit / investment) * 100)}.`,
          status: "ok",
        };

  return [paybackReading, returnReading, profitReading, yearReading];
}

// ---------------------------------------------------------------------------
// 4. Funding needed
// ---------------------------------------------------------------------------

export type FundingNeededInput = {
  monthlyBurn: number;
  monthlyRevenue: number;
  currentCash: number;
  monthsToCover: number;
};

export function fundingNeeded(input: FundingNeededInput): readonly Reading[] {
  const { monthlyBurn, monthlyRevenue, currentCash, monthsToCover } = input;
  const netBurn = monthlyBurn - monthlyRevenue;

  const netReading: Reading = {
    key: "net-burn",
    label: "Cash going out each month",
    display: formatRupees(netBurn),
    formula: `Monthly spending minus monthly revenue. ${formatRupees(monthlyBurn)} minus ${formatRupees(monthlyRevenue)} is ${formatRupees(netBurn)}.`,
    status: "ok",
  };

  // Covering your own costs is a real outcome with no runway to count, so it
  // is named rather than shown as a divide-by-zero or a negative month count.
  if (netBurn <= 0) {
    const spare = formatRupees(Math.abs(netBurn));
    const why =
      netBurn === 0
        ? "Revenue exactly matches spending, so the cash you hold stays where it is."
        : `Revenue is ${spare} a month more than you spend, so the cash you hold grows instead of running down.`;
    return [
      {
        key: "runway",
        label: "Months of runway",
        display: "Cash is not running out",
        formula:
          "Cash in hand divided by cash going out each month — which here is zero or less, so there is nothing to divide by.",
        note: why,
        status: "blocked",
        primary: true,
      },
      {
        key: "gap",
        label: "Funding gap to cover",
        display: formatRupees(0),
        formula: `Cash needed for ${formatCount(monthsToCover)} months minus cash in hand.`,
        note: "At these numbers you are not burning cash, so there is no gap to raise against.",
        status: "ok",
      },
      {
        key: "needed",
        label: `Cash needed for ${formatCount(monthsToCover)} months`,
        display: formatRupees(0),
        formula: `Cash going out each month multiplied by ${formatCount(monthsToCover)}.`,
        note: "Nothing is going out, so nothing is needed to cover the period.",
        status: "ok",
      },
      netReading,
    ];
  }

  const runwayMonths = currentCash / netBurn;
  const needed = netBurn * monthsToCover;
  const gap = Math.max(0, needed - currentCash);

  const runwayReading: Reading = {
    key: "runway",
    label: "Months of runway",
    display: formatMonths(runwayMonths),
    formula: `Cash in hand divided by cash going out each month. ${formatRupees(currentCash)} divided by ${formatRupees(netBurn)} a month is ${formatMonths(runwayMonths)}.`,
    status: "ok",
    primary: true,
    ...(currentCash === 0
      ? { note: "You entered no cash in hand, so there is no runway left at all." }
      : {}),
  };

  const neededReading: Reading = {
    key: "needed",
    label: `Cash needed for ${formatCount(monthsToCover)} months`,
    display: formatRupees(needed),
    formula: `Cash going out each month multiplied by ${formatCount(monthsToCover)}. ${formatRupees(netBurn)} times ${formatCount(monthsToCover)} is ${formatRupees(needed)}.`,
    status: "ok",
  };

  const gapReading: Reading = {
    key: "gap",
    label: "Funding gap to cover",
    display: formatRupees(gap),
    formula: `Cash needed for the period minus cash in hand. ${formatRupees(needed)} minus ${formatRupees(currentCash)} is ${formatRupees(needed - currentCash)}.`,
    status: "ok",
    ...(gap === 0
      ? {
          note: `Your cash already covers ${formatCount(monthsToCover)} months at this burn, so there is nothing to raise. A gap never goes below zero.`,
        }
      : {}),
  };

  return [runwayReading, gapReading, neededReading, netReading];
}

// ---------------------------------------------------------------------------
// 5. Runway
// ---------------------------------------------------------------------------

/**
 * `fundingNeeded` above also reports months of runway, on the way to a raise
 * amount. This one is deliberately the other half of that question: it never
 * asks how much to raise, and instead works backwards from the month you are
 * aiming for to the spending that reaches it and the cut that gets you there.
 */
export type RunwayInput = {
  currentCash: number;
  monthlySpend: number;
  monthlyRevenue: number;
  targetMonths: number;
};

export function runway(input: RunwayInput): readonly Reading[] {
  const { currentCash, monthlySpend, monthlyRevenue, targetMonths } = input;
  const netBurn = monthlySpend - monthlyRevenue;

  // `targetMonths` has a minimum of 1, so this division is always safe. The
  // ceiling is total spending, not net burn, because that is the number a
  // founder actually controls line by line.
  const spendCeiling = currentCash / targetMonths + monthlyRevenue;
  const cut = Math.max(0, monthlySpend - spendCeiling);

  const monthsReading: Reading =
    netBurn > 0
      ? {
          key: "months-left",
          label: "Months the money lasts",
          display: formatMonths(currentCash / netBurn),
          formula: `Cash in hand divided by cash going out each month. ${formatRupees(currentCash)} divided by ${formatRupees(netBurn)} a month is ${formatMonths(currentCash / netBurn)}.`,
          status: "ok",
          primary: true,
          ...(currentCash === 0
            ? { note: "You entered no cash in hand, so there is no runway left at all." }
            : {}),
        }
      : {
          key: "months-left",
          label: "Months the money lasts",
          display: "The money is not running out",
          formula:
            "Cash in hand divided by cash going out each month — which here is zero or less, so there is nothing to divide by.",
          note:
            netBurn === 0
              ? "Revenue exactly matches spending, so the cash you hold stays where it is."
              : `Revenue is ${formatRupees(Math.abs(netBurn))} a month more than you spend, so the cash you hold grows instead of running down.`,
          status: "blocked",
          primary: true,
        };

  return [
    monthsReading,
    {
      key: "spend-ceiling",
      label: `Most you can spend a month and still reach ${formatCount(targetMonths)} months`,
      display: formatRupees(spendCeiling),
      formula: `Cash in hand divided by ${formatCount(targetMonths)} months, plus the revenue you expect each month. ${formatRupees(currentCash)} divided by ${formatCount(targetMonths)} is ${formatRupees(currentCash / targetMonths)}, plus ${formatRupees(monthlyRevenue)} is ${formatRupees(spendCeiling)}.`,
      status: "ok",
    },
    {
      key: "cut-needed",
      label: `Monthly spending to cut to reach ${formatCount(targetMonths)} months`,
      display: formatRupees(cut),
      formula: `What you spend now minus the most you can spend. ${formatRupees(monthlySpend)} minus ${formatRupees(spendCeiling)} is ${formatRupees(monthlySpend - spendCeiling)}.`,
      status: "ok",
      ...(cut === 0
        ? {
            note: `You already spend less than that ceiling, so nothing has to be cut to reach ${formatCount(targetMonths)} months. A cut never goes below zero.`,
          }
        : {}),
    },
    {
      key: "net-burn",
      label: "Cash going out each month",
      display: formatRupees(netBurn),
      formula: `Monthly spending minus monthly revenue. ${formatRupees(monthlySpend)} minus ${formatRupees(monthlyRevenue)} is ${formatRupees(netBurn)}.`,
      status: "ok",
    },
  ];
}

// ---------------------------------------------------------------------------
// 6. Customer acquisition cost
// ---------------------------------------------------------------------------

export type AcquisitionCostInput = {
  adSpend: number;
  peopleCost: number;
  toolsCost: number;
  newCustomers: number;
};

export function acquisitionCost(input: AcquisitionCostInput): readonly Reading[] {
  const { adSpend, peopleCost, toolsCost, newCustomers } = input;
  const total = adSpend + peopleCost + toolsCost;

  const totalReading: Reading = {
    key: "total-spend",
    label: "Total spent on winning customers",
    display: formatRupees(total),
    formula: `Ads plus people plus tools. ${formatRupees(adSpend)} plus ${formatRupees(peopleCost)} plus ${formatRupees(toolsCost)} is ${formatRupees(total)}.`,
    status: "ok",
  };

  // Spending money and winning nobody is a real month, and the answer to it is
  // a sentence, not a division by zero.
  if (newCustomers === 0) {
    return [
      {
        key: "cac",
        label: "Cost to win one customer",
        display: "No customers to divide by",
        formula:
          "Total spent divided by customers won — which here is zero, so there is nothing to divide by.",
        note:
          total === 0
            ? "You spent nothing and won nobody, so there is no cost per customer to work out."
            : `You spent ${formatRupees(total)} and won nobody, so every rupee of it is unrecovered. There is no cost per customer until the first one arrives.`,
        status: "blocked",
        primary: true,
      },
      {
        key: "next-hundred",
        label: "Spend to win the next 100 customers",
        display: "Not yet knowable",
        formula: "Cost to win one customer multiplied by 100.",
        note: "Without a first customer there is no rate to multiply.",
        status: "blocked",
      },
      {
        key: "ad-share",
        label: "Ad spend per customer won",
        display: "No customers to divide by",
        formula: "Ad spend divided by customers won — which here is zero.",
        status: "blocked",
      },
      totalReading,
    ];
  }

  const cac = total / newCustomers;

  return [
    {
      key: "cac",
      label: "Cost to win one customer",
      display: formatRupees(cac, true),
      formula: `Total spent divided by customers won. ${formatRupees(total)} divided by ${formatCount(newCustomers)} is ${formatRupees(cac, true)}.`,
      status: "ok",
      primary: true,
      ...(total === 0
        ? {
            note: `You won ${formatCount(newCustomers)} customers without spending anything, so the cost per customer is zero.`,
          }
        : {}),
    },
    {
      key: "next-hundred",
      label: "Spend to win the next 100 customers",
      display: formatRupees(cac * 100),
      formula: `Cost to win one customer multiplied by 100. ${formatRupees(cac, true)} times 100 is ${formatRupees(cac * 100)}.`,
      note: "This assumes the next hundred cost what the last batch did. Your own experience decides whether they will.",
      status: "ok",
    },
    {
      key: "ad-share",
      label: "Ad spend per customer won",
      display: formatRupees(adSpend / newCustomers, true),
      formula: `Ad spend divided by customers won. ${formatRupees(adSpend)} divided by ${formatCount(newCustomers)} is ${formatRupees(adSpend / newCustomers, true)}.`,
      status: "ok",
    },
    totalReading,
  ];
}

// ---------------------------------------------------------------------------
// 7. Customer lifetime value
// ---------------------------------------------------------------------------

export type LifetimeValueInput = {
  monthlyRevenuePerCustomer: number;
  grossMarginPercent: number;
  monthlyChurnPercent: number;
  costToWinCustomer: number;
};

export function lifetimeValue(input: LifetimeValueInput): readonly Reading[] {
  const { monthlyRevenuePerCustomer, grossMarginPercent, monthlyChurnPercent, costToWinCustomer } =
    input;

  // Nobody leaving means no average lifespan to measure. That is a real answer
  // for a business with one cohort and no history, and it is named rather than
  // shown as an infinite customer.
  if (monthlyChurnPercent === 0) {
    return [
      {
        key: "ltv-margin",
        label: "Gross profit from one customer",
        display: "No leaving rate to measure",
        formula:
          "100 divided by the monthly leaving rate gives the average months a customer stays — and that rate is zero here, so there is nothing to divide by.",
        note: "At a zero leaving rate a customer never leaves, so their lifetime never ends and cannot be totalled. Use the rate you actually see, even a rough one.",
        status: "blocked",
        primary: true,
      },
      {
        key: "lifespan",
        label: "Months a customer stays",
        display: "No leaving rate to measure",
        formula: "100 divided by the monthly leaving rate.",
        status: "blocked",
      },
      {
        key: "ltv-revenue",
        label: "Revenue from one customer",
        display: "No leaving rate to measure",
        formula: "Monthly revenue per customer multiplied by the months they stay.",
        status: "blocked",
      },
      {
        key: "ratio",
        label: "Gross profit for every rupee spent winning them",
        display: "Not yet knowable",
        formula: "Gross profit from one customer divided by what it costs to win one.",
        status: "blocked",
      },
    ];
  }

  const lifespanMonths = 100 / monthlyChurnPercent;
  const revenueValue = monthlyRevenuePerCustomer * lifespanMonths;
  const marginValue = revenueValue * (grossMarginPercent / 100);

  const ratioReading: Reading =
    costToWinCustomer === 0
      ? {
          key: "ratio",
          label: "Gross profit for every rupee spent winning them",
          display: "Nothing spent to compare against",
          formula:
            "Gross profit from one customer divided by what it costs to win one — which here is zero, so there is nothing to divide by.",
          note: "You entered no cost to win a customer, so every rupee of gross profit is kept. Put in your real cost to see the comparison.",
          status: "blocked",
        }
      : {
          key: "ratio",
          label: "Gross profit for every rupee spent winning them",
          display: formatRupees(marginValue / costToWinCustomer, true),
          formula: `Gross profit from one customer divided by what it costs to win one. ${formatRupees(marginValue)} divided by ${formatRupees(costToWinCustomer)} is ${formatRupees(marginValue / costToWinCustomer, true)}.`,
          note: "This tool sets no target for that number. What counts as enough depends on how long you can wait to get the money back.",
          status: "ok",
        };

  return [
    {
      key: "ltv-margin",
      label: "Gross profit from one customer",
      display: formatRupees(marginValue),
      formula: `Revenue from one customer multiplied by your gross margin. ${formatRupees(revenueValue)} times ${formatPercent(grossMarginPercent)} is ${formatRupees(marginValue)}.`,
      status: "ok",
      primary: true,
      ...(grossMarginPercent === 0
        ? {
            note: "At a zero gross margin nothing is left after the cost of serving a customer, so their revenue never becomes profit.",
          }
        : {}),
    },
    {
      key: "lifespan",
      label: "Months a customer stays",
      display: formatMonths(lifespanMonths),
      formula: `100 divided by the share who leave each month. 100 divided by ${formatPercent(monthlyChurnPercent)} is ${formatMonths(lifespanMonths)}.`,
      status: "ok",
    },
    {
      key: "ltv-revenue",
      label: "Revenue from one customer",
      display: formatRupees(revenueValue),
      formula: `Monthly revenue per customer multiplied by the months they stay. ${formatRupees(monthlyRevenuePerCustomer)} times ${formatMonths(lifespanMonths)} is ${formatRupees(revenueValue)}.`,
      status: "ok",
    },
    ratioReading,
  ];
}

// ---------------------------------------------------------------------------
// 8. Market size
// ---------------------------------------------------------------------------

/**
 * TAM, SAM and SOM are normally sold with an industry figure dropped in at the
 * top. This one has no such figure and never will: every number below comes
 * out of the four boxes the visitor fills in. If they do not know how many
 * buyers exist, this tool cannot tell them — and says so rather than guessing.
 */
export type MarketSizeInput = {
  totalBuyers: number;
  annualSpendPerBuyer: number;
  reachablePercent: number;
  winnablePercent: number;
};

export function marketSize(input: MarketSizeInput): readonly Reading[] {
  const { totalBuyers, annualSpendPerBuyer, reachablePercent, winnablePercent } = input;

  const reachableBuyers = totalBuyers * (reachablePercent / 100);
  const winnableBuyers = reachableBuyers * (winnablePercent / 100);
  const tam = totalBuyers * annualSpendPerBuyer;
  const sam = reachableBuyers * annualSpendPerBuyer;
  const som = winnableBuyers * annualSpendPerBuyer;

  return [
    {
      key: "som",
      label: "Your realistic share, a year (SOM)",
      display: formatRupees(som),
      formula: `The buyers you can reach, narrowed to the share you think you can win, multiplied by what one pays a year. ${formatCount(Math.round(winnableBuyers))} buyers times ${formatRupees(annualSpendPerBuyer)} is ${formatRupees(som)}.`,
      status: "ok",
      primary: true,
      ...(som === 0
        ? {
            note: "One of your four numbers is zero, so this comes to nothing. Change it and the answer moves with it.",
          }
        : {}),
    },
    {
      key: "sam",
      label: "The part you can reach, a year (SAM)",
      display: formatRupees(sam),
      formula: `All buyers narrowed to the share you can actually sell to, multiplied by what one pays a year. ${formatCount(Math.round(reachableBuyers))} buyers times ${formatRupees(annualSpendPerBuyer)} is ${formatRupees(sam)}.`,
      status: "ok",
    },
    {
      key: "tam",
      label: "Everyone who could buy, a year (TAM)",
      display: formatRupees(tam),
      formula: `All buyers multiplied by what one pays a year. ${formatCount(totalBuyers)} times ${formatRupees(annualSpendPerBuyer)} is ${formatRupees(tam)}.`,
      note: "This is only as good as the buyer count you typed. This tool holds no market data and will not invent one for you.",
      status: "ok",
    },
    {
      key: "winnable-buyers",
      label: "Customers inside your realistic share",
      display: formatCount(Math.round(winnableBuyers)),
      formula: `All buyers, narrowed twice. ${formatCount(totalBuyers)} times ${formatPercent(reachablePercent)} is ${formatCount(Math.round(reachableBuyers))}, times ${formatPercent(winnablePercent)} is ${formatCount(Math.round(winnableBuyers))}.`,
      status: "ok",
    },
  ];
}

// ---------------------------------------------------------------------------
// The registry
// ---------------------------------------------------------------------------

const RUPEE_MAX = 1_000_000_000;

export const CALCULATORS: readonly Calculator[] = [
  {
    slug: "break-even",
    title: "Break-even",
    highlight: "calculator",
    answers: "How many units you have to sell before the business stops losing money.",
    intro:
      "Put in what your costs are, what you charge and what each unit costs you to make. This works out the point where money coming in finally matches money going out.",
    description:
      "Work out how many units you need to sell to break even, what that is worth in sales, and how long it takes at your own sales estimate. Rupee amounts, free, nothing saved.",
    fields: [
      {
        key: "fixedCosts",
        label: "Fixed costs to cover",
        group: "What it costs you",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Costs that stay the same whether you sell one unit or a thousand — rent, salaries, licences, machines.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 250000,
      },
      {
        key: "variableCostPerUnit",
        label: "Variable cost per unit",
        group: "What it costs you",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What one unit costs you to make and deliver — material, packing, courier, payment charges.",
        min: 0,
        max: 10_000_000,
        step: 1,
        defaultValue: 180,
      },
      {
        key: "pricePerUnit",
        label: "Price per unit",
        group: "What you charge and sell",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What one customer pays you for one unit, before any discount.",
        min: 0,
        max: 10_000_000,
        step: 1,
        defaultValue: 499,
      },
      {
        key: "unitsSoldPerMonth",
        label: "Units sold each month",
        group: "What you charge and sell",
        unitLabel: "units per month",
        suffix: "units / month",
        help: "Your own estimate of how many units you expect to sell in a month. Used only for the timeline.",
        min: 0,
        max: 1_000_000,
        step: 1,
        defaultValue: 300,
      },
    ],
    compute: (v) =>
      breakEven({
        fixedCosts: at(v, "fixedCosts"),
        variableCostPerUnit: at(v, "variableCostPerUnit"),
        pricePerUnit: at(v, "pricePerUnit"),
        unitsSoldPerMonth: at(v, "unitsSoldPerMonth"),
      }),
  },
  {
    slug: "startup-cost",
    title: "Startup cost",
    highlight: "calculator",
    answers: "What it costs to open the doors, and how long your cash lasts after that.",
    intro:
      "List the money you spend once to get started and the money you spend every month to keep going. This adds them up and tells you how many months your cash covers.",
    description:
      "Add up one-time and monthly startup costs in rupees, see the total needed to launch, and see how many months your cash lasts afterwards.",
    fields: [
      {
        key: "registration",
        label: "Registration and licences",
        group: "One-time costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Company registration, GST, FSSAI, trade licence, professional fees — whatever applies to you.",
        min: 0,
        max: RUPEE_MAX,
        step: 500,
        defaultValue: 15000,
      },
      {
        key: "equipment",
        label: "Equipment and furniture",
        group: "One-time costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Laptops, phones, machines, kitchen gear, tables, chairs — anything you buy once.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 120000,
      },
      {
        key: "deposit",
        label: "Deposit and fit-out",
        group: "One-time costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Rent deposit, painting, wiring, signboard, interiors. Leave at zero if you work from home.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 100000,
      },
      {
        key: "openingStock",
        label: "Opening stock or raw material",
        group: "One-time costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The first lot of goods or material you buy before selling anything. Zero for a service business.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 80000,
      },
      {
        key: "launchSpend",
        label: "Website, branding and launch",
        group: "One-time costs",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Domain, website, logo, photos, printing and the first push to get noticed.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 40000,
      },
      {
        key: "rent",
        label: "Rent",
        group: "Costs every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Shop, office or co-working rent each month, including maintenance.",
        min: 0,
        max: RUPEE_MAX,
        step: 500,
        defaultValue: 25000,
      },
      {
        key: "salaries",
        label: "Salaries",
        group: "Costs every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Everyone you pay each month, including yourself if you draw a salary.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 60000,
      },
      {
        key: "marketing",
        label: "Marketing",
        group: "Costs every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Ads, creators, offers, listing fees — whatever you spend each month to bring customers in.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 20000,
      },
      {
        key: "otherMonthly",
        label: "Everything else each month",
        group: "Costs every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Internet, electricity, software, accountant, travel, packing material.",
        min: 0,
        max: RUPEE_MAX,
        step: 500,
        defaultValue: 10000,
      },
      {
        key: "cashAvailable",
        label: "Cash you have",
        group: "Money in hand",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Savings, family money, a loan already approved — the money actually available to you today.",
        min: 0,
        max: RUPEE_MAX,
        step: 10000,
        defaultValue: 800000,
      },
    ],
    compute: (v) =>
      startupCost({
        registration: at(v, "registration"),
        equipment: at(v, "equipment"),
        deposit: at(v, "deposit"),
        openingStock: at(v, "openingStock"),
        launchSpend: at(v, "launchSpend"),
        rent: at(v, "rent"),
        salaries: at(v, "salaries"),
        marketing: at(v, "marketing"),
        otherMonthly: at(v, "otherMonthly"),
        cashAvailable: at(v, "cashAvailable"),
      }),
  },
  {
    slug: "roi",
    title: "Return on investment",
    highlight: "calculator",
    answers: "How long the money you put in takes to come back, and what it returns in a year.",
    intro:
      "Put in what you are investing and what the business earns and spends each month. This works out how many months it takes to get your money back and what that comes to over twelve months.",
    description:
      "Work out payback period and twelve-month return on a business investment, in rupees. Client-side, free, nothing saved.",
    fields: [
      {
        key: "investment",
        label: "Money you are putting in",
        group: "The investment",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The full amount you are putting in before the business starts earning.",
        min: 0,
        max: RUPEE_MAX,
        step: 10000,
        defaultValue: 500000,
      },
      {
        key: "monthlyRevenue",
        label: "Revenue each month",
        group: "Every month after that",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Money coming in from customers in a normal month, before costs.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 180000,
      },
      {
        key: "monthlyCost",
        label: "Cost each month",
        group: "Every month after that",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Everything you spend in that same month — rent, salaries, stock, ads, bills.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 120000,
      },
    ],
    compute: (v) =>
      roi({
        investment: at(v, "investment"),
        monthlyRevenue: at(v, "monthlyRevenue"),
        monthlyCost: at(v, "monthlyCost"),
      }),
  },
  {
    slug: "funding-needed",
    title: "Funding needed",
    highlight: "calculator",
    answers:
      "How long your cash lasts, and how much more you need to reach the month you are aiming for.",
    intro:
      "Put in what you spend, what you earn and what you hold. This works out how many months the cash lasts and how much you are short of the period you want covered.",
    description:
      "Work out months of runway and the funding gap for an Indian startup, in rupees, from monthly burn, cash in hand and expected revenue.",
    fields: [
      {
        key: "monthlyBurn",
        label: "Money going out each month",
        group: "Every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Everything you spend in a month — salaries, rent, stock, ads, bills, fees.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 250000,
      },
      {
        key: "monthlyRevenue",
        label: "Revenue you expect each month",
        group: "Every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Money you expect customers to pay you in a normal month. Zero if you have not started earning.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 90000,
      },
      {
        key: "currentCash",
        label: "Cash in hand today",
        group: "Where you stand",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What is actually in the bank right now, not what has been promised to you.",
        min: 0,
        max: RUPEE_MAX,
        step: 10000,
        defaultValue: 1200000,
      },
      {
        key: "monthsToCover",
        label: "Months you want covered",
        group: "Where you stand",
        unitLabel: "number of months",
        suffix: "months",
        help: "How far ahead you want the money to last before you have to raise again.",
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 12,
      },
    ],
    compute: (v) =>
      fundingNeeded({
        monthlyBurn: at(v, "monthlyBurn"),
        monthlyRevenue: at(v, "monthlyRevenue"),
        currentCash: at(v, "currentCash"),
        monthsToCover: at(v, "monthsToCover"),
      }),
  },
  {
    slug: "runway",
    title: "Runway",
    highlight: "calculator",
    answers: "How many months the money lasts, and what you have to cut to make it last longer.",
    intro:
      "Put in what you hold, what you spend and what you earn. This works out how long the money lasts, the most you can spend a month to reach the month you are aiming for, and the gap between the two.",
    description:
      "Work out how many months your cash lasts at your own burn, the monthly spending that reaches the month you are aiming for, and the cut needed to get there. Rupee amounts, free, nothing saved.",
    fields: [
      {
        key: "currentCash",
        label: "Cash in hand today",
        group: "Where you stand",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What is actually in the bank right now, not what has been promised to you.",
        min: 0,
        max: RUPEE_MAX,
        step: 10000,
        defaultValue: 600000,
      },
      {
        key: "targetMonths",
        label: "Months you are aiming to reach",
        group: "Where you stand",
        unitLabel: "number of months",
        suffix: "months",
        help: "How far ahead you want the money to last — the month of a launch, a first paying customer, or the next raise.",
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 12,
      },
      {
        key: "monthlySpend",
        label: "Money going out each month",
        group: "Every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Everything you spend in a month — rent, salaries, stock, ads, tools, bills, fees.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 85000,
      },
      {
        key: "monthlyRevenue",
        label: "Revenue you expect each month",
        group: "Every month",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Money you expect customers to pay you in a normal month. Zero if you have not started earning.",
        min: 0,
        max: RUPEE_MAX,
        step: 5000,
        defaultValue: 20000,
      },
    ],
    compute: (v) =>
      runway({
        currentCash: at(v, "currentCash"),
        monthlySpend: at(v, "monthlySpend"),
        monthlyRevenue: at(v, "monthlyRevenue"),
        targetMonths: at(v, "targetMonths"),
      }),
  },
  {
    slug: "customer-acquisition-cost",
    title: "Customer acquisition cost",
    highlight: "calculator",
    answers: "What one customer costs you to win, once ads, people and tools are counted.",
    intro:
      "Put in what you spent getting customers over a period and how many you actually won. This works out what one customer cost you, and what the next hundred would cost at the same rate.",
    description:
      "Work out customer acquisition cost in rupees from ad spend, people cost, tool cost and the customers you won. No benchmarks, no industry averages — only your own numbers.",
    fields: [
      {
        key: "adSpend",
        label: "Spent on ads and promotion",
        group: "What you spent in the period",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Every rupee paid to reach people — ads, boosted posts, flyers, a paid collaboration, a listing fee.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 20000,
      },
      {
        key: "peopleCost",
        label: "Spent on people doing the selling",
        group: "What you spent in the period",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Pay, commission or a share of your own time costed out, for whoever chased and closed customers in that period.",
        min: 0,
        max: RUPEE_MAX,
        step: 1000,
        defaultValue: 15000,
      },
      {
        key: "toolsCost",
        label: "Spent on tools for selling",
        group: "What you spent in the period",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "Subscriptions used to find or follow up customers in that period. Leave it at zero if you are on free plans.",
        min: 0,
        max: RUPEE_MAX,
        step: 500,
        defaultValue: 0,
      },
      {
        key: "newCustomers",
        label: "New customers won",
        group: "What you got",
        unitLabel: "number of customers",
        suffix: "customers",
        help: "How many paying customers that spending actually brought in. Count people who paid, not enquiries.",
        min: 0,
        max: 1_000_000,
        step: 1,
        defaultValue: 25,
      },
    ],
    compute: (v) =>
      acquisitionCost({
        adSpend: at(v, "adSpend"),
        peopleCost: at(v, "peopleCost"),
        toolsCost: at(v, "toolsCost"),
        newCustomers: at(v, "newCustomers"),
      }),
  },
  {
    slug: "customer-lifetime-value",
    title: "Customer lifetime value",
    highlight: "calculator",
    answers: "What one customer is worth in gross profit before they leave.",
    intro:
      "Put in what a customer pays you each month, what is left after the cost of serving them, and the share who leave each month. This works out how long they stay and what that is worth.",
    description:
      "Work out customer lifetime value in rupees from monthly revenue per customer, gross margin and your monthly churn rate, and compare it with what you spend to win one.",
    fields: [
      {
        key: "monthlyRevenuePerCustomer",
        label: "What one customer pays each month",
        group: "What a customer brings in",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "The average a single customer pays you in a month. For one-off sales, use what they spend in a month on average.",
        min: 0,
        max: 10_000_000,
        step: 100,
        defaultValue: 1500,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        group: "What a customer brings in",
        unitLabel: "as a percentage",
        suffix: "%",
        help: "Of every 100 rupees a customer pays, how many are left after the direct cost of serving them.",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 70,
      },
      {
        key: "monthlyChurnPercent",
        label: "Share of customers who leave each month",
        group: "How long they stay",
        unitLabel: "as a percentage",
        suffix: "%",
        help: "Out of 100 customers, how many stop paying in a month. A rough figure from your own records beats a guessed one.",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 5,
      },
      {
        key: "costToWinCustomer",
        label: "What it costs to win one customer",
        group: "How long they stay",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What you spend on average to get one customer. The acquisition cost calculator works this out if you do not know it.",
        min: 0,
        max: 10_000_000,
        step: 100,
        defaultValue: 1400,
      },
    ],
    compute: (v) =>
      lifetimeValue({
        monthlyRevenuePerCustomer: at(v, "monthlyRevenuePerCustomer"),
        grossMarginPercent: at(v, "grossMarginPercent"),
        monthlyChurnPercent: at(v, "monthlyChurnPercent"),
        costToWinCustomer: at(v, "costToWinCustomer"),
      }),
  },
  {
    slug: "market-size",
    title: "Market size",
    highlight: "calculator",
    answers:
      "What your market is worth a year, split into everyone, the reachable part, and your realistic share.",
    intro:
      "Put in how many buyers exist, what one spends a year, and how much of that you can reach and win. This works out TAM, SAM and SOM from your four numbers and nothing else.",
    description:
      "Work out TAM, SAM and SOM in rupees from your own buyer count, annual spend per buyer and the share you can reach and win. No market data, no industry averages.",
    fields: [
      {
        key: "totalBuyers",
        label: "Buyers who could want this",
        group: "The whole market",
        unitLabel: "number of buyers",
        suffix: "buyers",
        help: "How many people or businesses could buy what you sell at all. Count from a directory, a census figure or a list you can point to — not a feeling.",
        min: 0,
        max: 1_000_000_000,
        step: 1000,
        defaultValue: 50000,
      },
      {
        key: "annualSpendPerBuyer",
        label: "What one buyer spends a year",
        group: "The whole market",
        unitLabel: "in rupees",
        prefix: "₹",
        help: "What a single buyer pays for this kind of thing across a year, to you or to anyone else.",
        min: 0,
        max: 10_000_000,
        step: 500,
        defaultValue: 6000,
      },
      {
        key: "reachablePercent",
        label: "Share you can actually reach",
        group: "Your part of it",
        unitLabel: "as a percentage",
        suffix: "%",
        help: "Of all those buyers, how many you could serve given where you are, what you speak and what you can deliver.",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 20,
      },
      {
        key: "winnablePercent",
        label: "Share of those you think you can win",
        group: "Your part of it",
        unitLabel: "as a percentage",
        suffix: "%",
        help: "Of the buyers you can reach, how many you expect to choose you over every other option. Your own call, and worth keeping low.",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 5,
      },
    ],
    compute: (v) =>
      marketSize({
        totalBuyers: at(v, "totalBuyers"),
        annualSpendPerBuyer: at(v, "annualSpendPerBuyer"),
        reachablePercent: at(v, "reachablePercent"),
        winnablePercent: at(v, "winnablePercent"),
      }),
  },
];

export function findCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((calculator) => calculator.slug === slug);
}
