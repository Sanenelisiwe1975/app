export interface QuizQuestion {
  text: string;
  options: readonly string[];
  correct: number;
}

export interface SynchroModule {
  name: string;
  jse: string;
  training: string;
  questions: readonly QuizQuestion[];
}

export const SYNCHRO_MODULES: readonly SynchroModule[] = [
  {
    name: "The Real Cost of a Criminal Record",
    jse: "Opportunity Cost",
    training:
      "Having a criminal record blocks employment, bank accounts, travel, and business funding. The average lifetime loss exceeds R2.5 million. On the JSE, opportunity cost means choosing one investment over another – picking crime over education is the worst trade.",
    questions: [
      { text: "What is the approximate lifetime financial loss from a criminal record?", options: ["R50,000", "R500,000", "Over R2.5 million", "R10,000"], correct: 2 },
      { text: "Which JSE concept matches the cost of choosing crime over education?", options: ["Compound Interest", "Opportunity Cost", "Diversification", "Liquidity"], correct: 1 },
      { text: "What is one major consequence of a criminal record besides jail time?", options: ["Unable to open a bank account", "Free legal aid", "Higher salary", "Tax exemption"], correct: 0 },
      { text: "On the JSE, choosing a risky penny stock instead of a stable ETF illustrates:", options: ["Diversification", "Guaranteed profit", "Opportunity cost of lost growth", "Tax benefit"], correct: 2 },
    ],
  },
  {
    name: "Legal Income vs Quick Cash",
    jse: "Cash Flow vs Capital Gains",
    training:
      "Illegal 'quick cash' (selling stolen goods, scams) leads to confiscation, debt, and prison. Legal income from a spaza or job creates consistent cash flow. On the JSE, cash flow (dividends) provides steady returns, while capital gains come from selling assets at a higher price.",
    questions: [
      { text: "Which of these is an example of legal income?", options: ["Selling illegal cigarettes", "Running a registered spaza shop", "Drug dealing", "Bank robbery"], correct: 1 },
      { text: "On the JSE, consistent dividend payments are similar to:", options: ["Capital gains", "Cash flow", "Speculation", "Insider trading"], correct: 1 },
      { text: "What is a major risk of illegal 'quick cash'?", options: ["Tax benefits", "Confiscation and prison", "Guaranteed returns", "Zero risk"], correct: 1 },
      { text: "Capital gains on the JSE come from:", options: ["Selling shares at a higher price", "Monthly interest", "Dividend reinvestment", "Loan payments"], correct: 0 },
    ],
  },
  {
    name: "Stokvel vs Criminal Syndicate",
    jse: "Diversification & Pooled Risk",
    training:
      "A criminal syndicate concentrates risk – one arrest loses everything. A legal stokvel (community savings club) spreads risk and builds collective wealth. On the JSE, diversification reduces losses when one asset performs poorly.",
    questions: [
      { text: "What is a stokvel?", options: ["A criminal gang", "A legal community savings club", "A government tax", "An illegal lottery"], correct: 1 },
      { text: "On the JSE, diversification helps to:", options: ["Increase risk", "Concentrate losses", "Reduce risk by spreading investments", "Avoid paying tax"], correct: 2 },
      { text: "What happens if one member of a criminal syndicate is arrested?", options: ["The group becomes stronger", "The whole network may collapse", "Nothing changes", "Police give rewards"], correct: 1 },
      { text: "In a stokvel, members contribute money to:", options: ["Buy weapons", "Pay bribes", "Save and rotate payouts", "Avoid taxes"], correct: 2 },
    ],
  },
  {
    name: "Scam or Legitimate Investment?",
    jse: "Fundamental Analysis",
    training:
      "Scams promise 'guaranteed 50% monthly returns' but have no real business. Legitimate JSE companies publish annual reports, revenue, debt, and profits. Fundamental analysis means studying a company's financial health before investing.",
    questions: [
      { text: "Which of these is a red flag for a scam?", options: ["Published annual report", "Guaranteed 50% monthly return", "Registered company number", "Audited financials"], correct: 1 },
      { text: "Fundamental analysis involves studying a company's:", options: ["Share price only", "Financial statements and health", "Social media followers", "Office location"], correct: 1 },
      { text: "A legitimate JSE company must publish:", options: ["No financial data", "Annual financial statements", "Only a logo", "Only a phone number"], correct: 1 },
      { text: "If an 'investment' promises high returns with no risk, it is likely:", options: ["A safe bet", "A scam", "A government bond", "An index fund"], correct: 1 },
    ],
  },
  {
    name: "Reinvestment & Compound Growth",
    jse: "Compound Interest",
    training:
      "Crime leads to debt and repeat cycles. Saving R200/month and investing at 10% return grows to over R41,000 in 10 years. On the JSE, compound interest means your returns also earn returns – the earlier you start, the more you gain.",
    questions: [
      { text: "Investing R200/month for 10 years at 10% return yields approximately:", options: ["R2,000", "R12,000", "Over R41,000", "R100,000"], correct: 2 },
      { text: "Compound interest means:", options: ["Interest only on initial amount", "Interest on both initial and accumulated interest", "No interest at all", "Interest only on profits"], correct: 1 },
      { text: "Why is starting to save early important?", options: ["Returns are higher in first year", "Compound growth needs time to work", "Inflation doesn't affect early savers", "Banks give bonuses"], correct: 1 },
      { text: "Which habit leads to long-term wealth?", options: ["Spending all income", "Consistent small savings and investing", "Borrowing from mashonisas", "Ignoring budgets"], correct: 1 },
    ],
  },
] as const;
