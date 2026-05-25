export interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
}

export interface Module {
  id: number;
  name: string;
  notes: string;
  quiz: QuizQuestion[];
}

export interface Mindset {
  id: string;
  name: string;
  desc: string;
  startCash: number;
  icon: string;
  assets: string[];
  modules: Module[];
  tagline: string;
  color: string;
}

export interface Audience {
  name: string;
  mindsets: Mindset[];
}

export const audiences: Record<string, Audience> = {
  youth: {
    name: "Youth Entrepreneur",
    mindsets: [
      {
        id: "spaza",
        name: "Spaza Shop Owner",
        desc: "Township retail & stock management mastery",
        startCash: 5000,
        icon: "🏪",
        assets: ["BRD", "COKE", "TRANS"],
        tagline: "From corner shop to corner office",
        color: "#E67E22",
        modules: [
          {
            id: 1,
            name: "The Stock Shelf Strategy",
            notes: "Your spaza shelf is your balance sheet. Fast-moving items (bread, airtime) = liquid assets. Slow stock = dead capital. Rotate stock every 48 hours. A spaza that runs out of bread loses R150/day in trust, not just sales.",
            quiz: [
              { q: "Your bread supplier offers 30-day credit. What's the risk?", opts: ["You pay more", "Cash flow trap — sales might not cover the bill", "Free money"], correct: 1 },
              { q: "A customer asks to buy on credit (ukuva). Best response?", opts: ["Always yes — more sales", "Never — cash only builds discipline", "Small limit, tracked in a book"], correct: 2 },
              { q: "Your competitor drops prices by 20%. You should?", opts: ["Match immediately", "Add value (delivery, loyalty card) instead", "Close shop"], correct: 1 },
              { q: "Cash is low. Which product to reorder first?", opts: ["The cheapest to buy", "The fastest-selling (bread, airtime)", "The most expensive per unit"], correct: 1 },
              { q: "A shebeen offers to display your airtime for R50/week. Risk?", opts: ["None — pure extra income", "Brand link to alcohol may hurt community trust", "Great partnership"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "The Float Game",
            notes: "Float is your oxygen. R500 in coins and small notes prevents lost sales. But float is not profit — it's working capital. Separate your till money from your personal pocket. The best spaza owners have 'two pockets' discipline.",
            quiz: [
              { q: "You have R2,000 total. R1,200 is stock, R500 is float. What's profit?", opts: ["R2,000", "R300 (if no debts)", "R1,200"], correct: 1 },
              { q: "Why keep change in coins, not just notes?", opts: ["Looks professional", "Faster transactions = more customers/hour", "Banks require it"], correct: 1 },
              { q: "Using till money for taxi fare is?", opts: ["Normal", "Theft from your future", "Smart cash flow"], correct: 1 },
              { q: "End of month: R3,000 in till, float R500, stock cost R1,500. Take-home profit?", opts: ["R3,000 — all of it", "R1,000 after float and restocking", "R2,500"], correct: 1 },
              { q: "Mixing personal and business money long-term means?", opts: ["No problem if tracked mentally", "No clean financials — loan applications rejected", "Bank sorts it out"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Supplier Wars & Bulk Power",
            notes: "Buying 10 cases gets you 15% off? Do the math. Bulk discounts only work if you sell before expiry. Negotiate — suppliers expect it. Build relationships with 2+ suppliers so one can't hold you hostage. Your buying power grows with your consistency.",
            quiz: [
              { q: "A supplier offers 20% off for bulk, but stock expires in 30 days. You sell 2/day. Buy?", opts: ["Yes — discount is huge", "No — you'll throw away half", "Buy 50% more only"], correct: 2 },
              { q: "Having only one supplier is dangerous because?", opts: ["They might raise prices anytime", "You can't compare quality", "Both are true"], correct: 2 },
              { q: "Best time to negotiate with suppliers?", opts: ["Monday morning", "Month-end when they need sales", "Friday evening"], correct: 1 },
              { q: "Supplier offers R500 weekly credit. You sell R800/week. Should you take it?", opts: ["Yes — buy more, sell more", "Only if you have buffer to cover when sales dip", "Never use supplier credit"], correct: 1 },
              { q: "One supplier is cheaper but always late. Another is R50 more but punctual. Choose?", opts: ["Cheaper — margins matter most", "Punctual — empty shelves cost more than R50", "Both are equally acceptable"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "The After-School Rush",
            notes: "Peak hours (3pm-6pm) generate 60% of daily revenue. Staff accordingly. Pre-package snacks for speed. Your queue length determines your daily ceiling — every 30 seconds saved per customer adds 20+ sales in a rush hour.",
            quiz: [
              { q: "Rush hour is 3 hours long. A transaction takes 2 mins. How many max sales?", opts: ["60", "90", "120"], correct: 1 },
              { q: "Pre-packaging chips and sweets saves time but costs?", opts: ["Nothing — labour is free", "Labour hours and packaging", "Customer satisfaction"], correct: 1 },
              { q: "Hiring a helper for rush hour only is?", opts: ["Wasteful", "Smart variable costing", "Illegal part-time"], correct: 1 },
              { q: "You run out of a hot item mid-rush. Customer goes to competitor. Real cost?", opts: ["Just that one sale lost", "Lost sale + lost trust + competitor gains loyalty", "Nothing — they return next time"], correct: 1 },
              { q: "Hire a teenager for R80/rush shift. They serve 30 extra customers at R15 avg. Profit?", opts: ["Break-even — R80 each", "R370 gain (R450 revenue minus R80 labour)", "A loss — too risky"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Spaza to Franchise",
            notes: "Document everything. Your sales patterns, popular items, peak hours — this data is worth money to franchisees and investors. A spaza with 3 years of books can get a business loan. Without books, you're just a person with a shop.",
            quiz: [
              { q: "Why keep daily sales records?", opts: ["Tax requirement only", "Proof of income for loans & growth", "Parents ask for it"], correct: 1 },
              { q: "A bank asks for 3 years of books. You have 3 months. Result?", opts: ["They average it out", "Loan denied — insufficient history", "They accept a letter"], correct: 1 },
              { q: "Your shop makes R500/day. Annual revenue is?", opts: ["R182,500", "R150,000 (minus holidays)", "R200,000"], correct: 0 },
              { q: "To open a business bank account, minimum documents are?", opts: ["ID only", "ID + proof of address + CIPC registration or proof of business", "Just ask the bank nicely"], correct: 1 },
              { q: "A chain store opens 500m away. Your best strategy?", opts: ["Panic and prepare to close", "Specialize in fresh goods and community credit — differentiate", "Match their prices immediately"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "taxi",
        name: "Taxi Owner",
        desc: "Transport empire & route economics",
        startCash: 8000,
        icon: "🚐",
        assets: ["FUEL", "TYRES", "TRANS"],
        tagline: "Every route is a revenue stream",
        color: "#F1C40F",
        modules: [
          {
            id: 1,
            name: "The Route ROI",
            notes: "Not all routes are equal. Route A: R80/load, 12 trips/day, high competition. Route B: R120/load, 8 trips, monopoly. Calculate revenue per hour, not per trip. A slow premium route beats a fast cheap one.",
            quiz: [
              { q: "Route A: 12 trips × R80 = R960. Route B: 8 trips × R120 = R960. Which is better?", opts: ["Same money, same value", "Route B — less wear on vehicle", "Route A — more practice"], correct: 1 },
              { q: "Fuel is 40% of revenue. If you do more short trips, fuel %?", opts: ["Stays 40%", "Goes up — more stopping/starting", "Goes down"], correct: 1 },
              { q: "A new route has no competition but low passengers. Strategy?", opts: ["Wait for demand", "Run it 2x/week to test, advertise", "Skip it"], correct: 1 },
              { q: "Rain reduces passengers by 30%. Your fixed costs stay the same. Impact on profit?", opts: ["Revenue drops 30%, profit drops more than 30%", "Revenue and profit both drop 30%", "No impact — people always use taxis"], correct: 0 },
              { q: "Two drivers apply: one knows your route, one is newer with a clean record. Hire?", opts: ["Route knowledge is most important", "Clean record — safety saves insurance and legal costs", "Flip a coin — both equal"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "The Tyre & Maintenance Fund",
            notes: "Tyres, brakes, and engine failures don't announce themselves. Put 15% of daily revenue into a maintenance fund. When a tyre blows at 5am, that fund is your business saviour. Without it, you're borrowing from loan sharks at 30% monthly.",
            quiz: [
              { q: "You make R1,000/day. How much to maintenance fund?", opts: ["R50", "R150 (15%)", "R300"], correct: 1 },
              { q: "A tyre costs R2,500. Your fund has R1,800. Best option?", opts: ["Buy cheap R1,200 tyre", "Top up fund over 2 weeks, then buy quality", "Borrow from family"], correct: 1 },
              { q: "Maintenance fund should be kept?", opts: ["In cash at home", "In a separate savings account", "Mixed with daily float"], correct: 1 },
              { q: "Skipped maintenance fund 3 months. Engine light comes on. True cost beyond repair?", opts: ["Just the repair bill", "Repair + loan interest at 30%/month if you borrow to cover it", "Nothing — you'll manage"], correct: 1 },
              { q: "Mechanic offers second-hand parts to save R800. Best practice?", opts: ["Always take savings where you can", "Only for non-critical parts — never brakes or steering", "Always insist on new parts only"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Driver Management",
            notes: "Your driver is your partner and your risk. A reckless driver costs you in fines, accidents, and reputation. Pay drivers a base + commission on clean days. Install GPS — not to spy, but to prove route compliance and settle disputes with data.",
            quiz: [
              { q: "Driver is paid flat R300/day regardless of trips. Problem?", opts: ["None — simple system", "No incentive to work harder", "Too expensive"], correct: 1 },
              { q: "GPS tracking primarily helps with?", opts: ["Spying on driver", "Proving route & speed for disputes", "Entertainment"], correct: 1 },
              { q: "Driver has 3 speeding fines in a month. Action?", opts: ["Pay fines — cost of business", "Warning then replacement if continues", "Ignore — not your car"], correct: 1 },
              { q: "Driver claims 14 trips but GPS shows 11. What do you do?", opts: ["Believe driver — GPS has errors", "Confront with GPS data, adjust payment, monitor closely", "Fire immediately without discussion"], correct: 1 },
              { q: "Driver wants to rent the taxi himself after hours. Main consideration?", opts: ["Pure profit — say yes always", "Extra income but doubles wear — review insurance and set conditions", "Always refuse — too risky"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "The Association Game",
            notes: "Taxi associations control routes, disputes, and sometimes violence. Pay your dues on time. Attend meetings — decisions made there affect your income. Build allies, not enemies. A R200/month membership can prevent a R20,000 route war.",
            quiz: [
              { q: "You skip association meetings to save time. Risk?", opts: ["None — just social events", "Rules change without your input, you get fined", "You lose friends"], correct: 1 },
              { q: "Association fee is R200/month. Annual cost?", opts: ["R2,000", "R2,400", "R1,200"], correct: 1 },
              { q: "A route dispute arises. Best resolution?", opts: ["Fight at the rank", "Association mediation with evidence", "Social media battle"], correct: 1 },
              { q: "A new operator uses your route without joining the association. Your position?", opts: ["Welcome competition — keeps you sharp", "Raise it at association — unauthorized operators cut everyone's income", "Ignore it — not your problem"], correct: 1 },
              { q: "Association proposes raising route fare. You vote how?", opts: ["Always yes — more money", "Calculate if passengers can afford it — pricing yourself out is worse", "Always no — fares hurt demand"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "Fleet Expansion Logic",
            notes: "One taxi = a job. Two taxis = a business. Three+ = an empire. But expansion needs systems, not just cash. Can you manage drivers, maintenance, and routes for multiple vehicles? If not, you're scaling chaos. Document first, duplicate second.",
            quiz: [
              { q: "You want a second taxi. First requirement?", opts: ["Enough cash to buy it", "Systems to manage driver, maintenance, routes", "A bigger parking spot"], correct: 1 },
              { q: "Two taxis, both managed the same way. Risk?", opts: ["None — consistency is good", "One issue becomes two if system fails", "Drivers might compete"], correct: 1 },
              { q: "Fleet expansion financing: cash vs loan?", opts: ["Always cash — no debt", "Loan preserves cash for emergencies", "Always loan — tax benefits"], correct: 1 },
              { q: "You have R120K saved, second taxi costs R180K. Best approach?", opts: ["Wait until you have the full R180K", "R60K deposit + finance R120K if daily revenue covers installments", "Borrow R180K from friends"], correct: 1 },
              { q: "Second taxi driver quits without notice. Revenue impact without a backup plan?", opts: ["Zero — find someone tomorrow", "100% of that taxi's income lost until replacement found and trained", "50% loss only"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "food",
        name: "Street Food Vendor",
        desc: "Food stall & daily cash flow mastery",
        startCash: 2000,
        icon: "🍞",
        assets: ["FOOD", "EQUIP", "SAVE"],
        tagline: "The streets are your stock exchange",
        color: "#E74C3C",
        modules: [
          {
            id: 1,
            name: "The Margin Recipe",
            notes: "Your food cost should be 30-35% of selling price. R5 of inputs sells for R15. If you're at 50% food cost, you're working for your suppliers. Track every gram of oil, every head of cabbage. Weigh, measure, profit.",
            quiz: [
              { q: "You sell a plate for R30. Food cost should be?", opts: ["R15", "R9-R10.50", "R20"], correct: 1 },
              { q: "Oil prices rise 25%. You use 2L/day. Impact?", opts: ["Small — just oil", "Rises food cost %, squeeze margin or raise price", "None — customers pay"], correct: 1 },
              { q: "A supplier offers cheaper but lower quality oil. You?", opts: ["Buy it — margins matter", "Test with customers first, reputation is everything", "Always premium"], correct: 1 },
              { q: "New menu item has 45% food cost. Action?", opts: ["Keep it — customers love it", "Reduce portion or raise price to hit 30-35% target", "Remove it immediately"], correct: 1 },
              { q: "Saturday market generates 3x normal sales. How to prepare?", opts: ["Make everything day-of as usual", "Pre-cook sauces, pre-portion ingredients, bring extra float", "Close normal spot and just go to market"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "The Daily Float Ritual",
            notes: "Start every day with exactly R300 in float: R100 in coins, R200 in small notes. At day's end, everything above your float + ingredient cost = profit. This is the 'float method' — simple, foolproof, and no bookkeeping degree required.",
            quiz: [
              { q: "Start with R300 float. End with R1,800. Ingredients cost R400. Profit?", opts: ["R1,800", "R1,100", "R1,500"], correct: 1 },
              { q: "Why separate float from profit immediately?", opts: ["Looks organized", "Prevents accidentally spending tomorrow's change", "Tax reasons"], correct: 1 },
              { q: "You forget float amount and mix it with sales. Result?", opts: ["Simpler banking", "No idea of true profit — flying blind", "More profit"], correct: 1 },
              { q: "By Wednesday your float is R50. Risk of not replenishing?", opts: ["Small — people have exact change", "Lost sales — customers without change go elsewhere", "No risk at all"], correct: 1 },
              { q: "You've never recorded daily profits. You apply for a SEFA grant. Result?", opts: ["Approved — they trust you", "Rejected — no evidence of business income or history", "They estimate for you"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "The Hot Spot Strategy",
            notes: "Location is 70% of street food success. Factory shifts = 7am & 5pm rushes. Taxi ranks = all-day flow. Construction sites = heavy lunch. Match your menu to your location's crowd. A bunny chow at a taxi rank sells 3x faster than a wrap.",
            quiz: [
              { q: "You're outside a factory. Best menu item?", opts: ["Gourmet sandwich", "Quick, filling, affordable meal", "Coffee and croissant"], correct: 1 },
              { q: "A new office block opens nearby. First move?", opts: ["Keep same menu", "Add lighter, faster options for office workers", "Raise prices"], correct: 1 },
              { q: "Rainy day sales drop 50%. Prepare by?", opts: ["Closing early", "Having umbrella cover, warm menu ready", "Praying"], correct: 1 },
              { q: "A new vendor sets up identical menu 5m from you at the taxi rank. Response?", opts: ["Leave — competition is bad for you", "Differentiate with better packaging, loyalty cards, larger portions", "Report them to rank marshals"], correct: 1 },
              { q: "Moving to a corporate area for higher margins means losing regulars. Risk?", opts: ["Manageable — new area is always better", "Revenue gap while rebuilding clientele — test 1 day/week first", "No real risk at all"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Waste Not, Want Not",
            notes: "Unsold food is lost money. But safety comes first — no reheating meat more than once. Plan for 90% sell-through. Any leftovers: discount at day's end, or donate (tax deductible). Never serve yesterday's food as today's fresh.",
            quiz: [
              { q: "You have 10 unsold portions at 7pm. Action?", opts: ["Serve tomorrow — waste not", "Discount 50% for quick sale", "Throw away — safety first"], correct: 1 },
              { q: "Daily waste target should be?", opts: ["0% — perfect planning", "Under 10% — realistic buffer", "20% — shows abundance"], correct: 1 },
              { q: "Donating food instead of trashing it?", opts: ["Loss", "Community goodwill + potential tax benefit", "Illegal for vendors"], correct: 1 },
              { q: "Leftover food donated to a church feeding scheme. Tax benefit?", opts: ["None — street vendors can't claim tax", "Documented donations can reduce tax if you are SARS-registered", "Only registered companies qualify"], correct: 1 },
              { q: "You overcooked on a slow day. For tomorrow's service?", opts: ["Serve as fresh — no one will know", "Deep discount today to clear it, or discard — health and trust first", "Freeze and use next week for stews"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Stall to Brand",
            notes: "Your cart, your uniform, your greeting — that's your brand. Consistent quality builds word-of-mouth. A branded food cart gets 30% more trust (and tips). Take photos for social media. One viral post can double your queue.",
            quiz: [
              { q: "Why brand your food stall with a name and colour?", opts: ["Looks fancy", "Recognition and trust = more customers", "Tax requirement"], correct: 1 },
              { q: "A customer posts your food online. You?", opts: ["Ignore — social media is for kids", "Engage, thank them, repost — free marketing", "Ask them to delete it"], correct: 1 },
              { q: "Brand consistency means?", opts: ["Same colours always", "Same taste, service, and appearance every day", "Same price forever"], correct: 1 },
              { q: "A food blogger posts your stall online. Why does your response time matter?", opts: ["It doesn't — post when free", "Viral windows close in 24-48 hours — engage now for maximum reach", "Reply next week when you have time"], correct: 1 },
              { q: "You want to trademark 'Mama's Kitchen' at CIPC. Approximate cost?", opts: ["It's free — no cost to register", "Around R590 per class — small investment for brand protection", "Around R10,000 — very expensive"], correct: 1 }
            ]
          }
        ]
      }
    ]
  },
  university: {
    name: "University Student",
    mindsets: [
      {
        id: "engineering",
        name: "Engineering Mindset",
        desc: "Cost estimation & project finance precision",
        startCash: 10000,
        icon: "⚙️",
        assets: ["MACHINE", "TECH", "BOND"],
        tagline: "Build wealth with engineering precision",
        color: "#2980B9",
        modules: [
          {
            id: 1,
            name: "The Project Budget Blueprint",
            notes: "Every project has three budgets: optimistic, realistic, and contingency (15-20%). Engineers who budget precisely earn trust. Trust earns bigger contracts. A 10% cost overrun on a R2M project is R200,000 — that's someone's salary.",
            quiz: [
              { q: "A R500,000 project needs contingency. How much?", opts: ["R25,000", "R75,000-R100,000", "R200,000"], correct: 1 },
              { q: "Client asks for 'best case' budget. You show?", opts: ["Optimistic — win the bid", "Realistic + contingency — protect both sides", "Pessimistic — scare them"], correct: 1 },
              { q: "Cost overrun on your project. First step?", opts: ["Hide it", "Communicate early with solutions", "Pay from your pocket"], correct: 1 },
              { q: "Client approved R500K but mid-project it needs R600K. Your obligation?", opts: ["Absorb the extra — you quoted it", "Issue a formal variation order and notify client immediately", "Complete work then invoice R600K unannounced"], correct: 1 },
              { q: "Which risk is hardest to predict in a South African construction project?", opts: ["Material price changes", "Municipal delays and load shedding impact on schedule", "Labour cost increases"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Material Cost Optimization",
            notes: "Steel prices fluctuate. Cement has seasonal pricing. Buying during low season saves 15-25%. But storage costs money. The optimization equation: (Seasonal savings) - (Storage cost + Obsolescence risk) = True savings.",
            quiz: [
              { q: "Steel is 20% cheaper in winter. You need it in summer. Buy now?", opts: ["Yes — always save", "Calculate storage cost vs savings first", "No — just-in-time only"], correct: 1 },
              { q: "Material obsolescence risk means?", opts: ["It gets old", "Technology changes make it unusable", "It rusts"], correct: 1 },
              { q: "Bulk buying discount is 15% but requires warehouse rental. Decision?", opts: ["Always bulk buy", "Bulk buy only if rental < 15% savings", "Never bulk buy"], correct: 1 },
              { q: "Cement price spikes due to import restrictions mid-project. Mitigation?", opts: ["Stop project until price normalises", "Find alternative local supplier or adjust scope with client approval", "Absorb the cost silently"], correct: 1 },
              { q: "You bought bulk steel. Prices drop 10% the week after. Lesson?", opts: ["Never bulk-buy again", "No lesson — future prices are unknowable, the decision was sound on the day", "Sell excess at a loss immediately"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Labour Cost Engineering",
            notes: "Labour is 40-60% of project cost. Skilled workers cost more per hour but finish faster with fewer errors. Calculate cost per deliverable, not cost per hour. A R500/hour expert who finishes in 2 days beats a R200/hour novice who takes a week.",
            quiz: [
              { q: "Expert: R600/hr × 16 hrs = R9,600. Novice: R250/hr × 40 hrs = R10,000. Pick?", opts: ["Novice — cheaper hourly", "Expert — lower total cost + faster", "Flip a coin"], correct: 1 },
              { q: "Overtime pay is 1.5x. When is it worth it?", opts: ["Always — more work done", "When project delay penalties exceed overtime cost", "Never — kills morale"], correct: 1 },
              { q: "Subcontracting vs permanent team?", opts: ["Always permanent", "Subcontract for variable workloads, permanent for core", "Always subcontract"], correct: 1 },
              { q: "Strike delays your project 2 weeks. Client has R10,000/day penalty clauses. Your exposure?", opts: ["Zero — strike is force majeure automatically", "Depends on contract — review force majeure clause immediately", "Maximum R140,000 — fixed by law"], correct: 1 },
              { q: "A junior engineer makes a R2,000 error on site. Who carries liability?", opts: ["The junior engineer personally", "Depends on supervision structure and contract indemnities", "Always the company — no exceptions"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Equipment Finance",
            notes: "That R800,000 machine. Lease? Buy with loan? Rent per job? The answer depends on utilization. Under 40% utilization = rent. 40-70% = lease. 70%+ = buy. Depreciation is a real cost, even if it's 'just accounting'.",
            quiz: [
              { q: "You need a machine 25% of the time. Best option?", opts: ["Buy — it's an asset", "Rent per use — no idle cost", "Lease — middle ground"], correct: 1 },
              { q: "Depreciation affects?", opts: ["Only accounting books", "Tax, profit, and replacement fund", "Nothing — it's fake"], correct: 1 },
              { q: "Machine breaks down mid-project. Prevention?", opts: ["Buy cheaper backup", "Maintenance contract + downtime insurance", "Hope it doesn't break"], correct: 1 },
              { q: "Machine rental is R5,000/day. Job needs it 60 days. Buy at R180,000 or rent?", opts: ["Buy — R300K rental beats R180K purchase price", "Rent — no idle cost between projects", "Buy only if you have 70%+ utilisation going forward"], correct: 0 },
              { q: "Leased machine breaks down, stopping production. Lease agreement should include?", opts: ["Nothing — breakdown is your problem", "Replacement equipment clause or compensation for downtime", "Just delivery and setup terms"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Graduate to Consulting",
            notes: "Your engineering degree is a license to consult. Start with small structural assessments. Build a portfolio. Register with ECSA. A graduate consultant at R800/hour makes more than a junior engineer at R35,000/month — with freedom.",
            quiz: [
              { q: "Junior engineer salary: R35,000/month. Consulting at R800/hr × 60 hrs/month?", opts: ["Less money", "R48,000 — more with flexibility", "Same"], correct: 1 },
              { q: "First consulting client should be?", opts: ["Big corporate — more money", "Small job you can't fail — builds reputation", "Family — free"], correct: 1 },
              { q: "ECSA registration is important because?", opts: ["Just a certificate", "Legal requirement for certain work + credibility", "University requirement"], correct: 1 },
              { q: "Client pays R50,000 for a report. You haven't registered a company or VAT. Risk?", opts: ["No risk — it's just one invoice", "Personal tax liability, possible VAT exposure, no legal protection", "The bank handles all of this"], correct: 1 },
              { q: "You win a R2M consulting project but need R300K upfront for equipment. Solution?", opts: ["Decline the project", "Negotiate a 30-50% deposit as part of contract terms", "Use all personal savings always"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "accounting",
        name: "Accounting Pro",
        desc: "Financial statements, tax & audit mastery",
        startCash: 12000,
        icon: "📊",
        assets: ["STOCK", "BOND", "SAVE"],
        tagline: "Numbers don't lie, but they can hide",
        color: "#1ABC9C",
        modules: [
          {
            id: 1,
            name: "The Trial Balance Truth",
            notes: "Debits = Credits. Always. If they don't match, you haven't found the error yet. A trial balance is your financial report's heartbeat. Learn to read the story behind the numbers — a rising creditor balance with flat sales means cash flow trouble.",
            quiz: [
              { q: "Trial balance shows debits = R50,000, credits = R48,000. Meaning?", opts: ["R2,000 profit", "R2,000 error somewhere", "R2,000 asset"], correct: 1 },
              { q: "Creditors increasing while sales stay flat suggests?", opts: ["Business is growing", "Buying more on credit than selling — cash flow crisis", "Good supplier relationships"], correct: 1 },
              { q: "Best time to spot errors?", opts: ["Year-end", "Monthly trial balance review", "During audit"], correct: 1 },
              { q: "Client's debtors balance hasn't moved in 6 months. Accounting concern?", opts: ["None — debtors are stable, that's good", "Possible bad debts — investigate and raise a provision", "Great sign — loyal customers"], correct: 1 },
              { q: "Bank statement unreconciled for 3 months. Risk?", opts: ["Minor — catch up when free", "Undetected fraud, compounding errors, missed bank charges", "No risk — the bank is always correct"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Tax Strategy Essentials",
            notes: "Tax evasion = illegal. Tax avoidance = smart planning. Maximize deductions: home office, vehicle logbook, retirement contributions. SARS audits are increasing. Clean records, proper invoices, and timely filings are your armor.",
            quiz: [
              { q: "Difference between tax evasion and avoidance?", opts: ["Same thing", "Evasion is illegal, avoidance is legal planning", "Avoidance is illegal"], correct: 1 },
              { q: "A vehicle used 60% for business. What % of costs deductible?", opts: ["100%", "60%", "0%"], correct: 1 },
              { q: "SARS asks for 5 years of invoices. You have 2. Penalty?", opts: ["Warning", "Up to 200% of tax liability + criminal charges", "R1,000 fine"], correct: 1 },
              { q: "Client puts a non-working family member on payroll. You discover this. As their accountant?", opts: ["Stay silent — client decision", "Advise client of the fraud risk and correct the error", "Report to SARS immediately without discussion"], correct: 1 },
              { q: "Client misses provisional tax deadline. Best immediate action?", opts: ["Pay nothing — it's late anyway", "Pay immediately — interest and penalties accrue daily", "Wait for formal SARS assessment"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Audit Defense",
            notes: "Auditors are not enemies — they're verification partners. Prepare working papers that tell a story. Every number must have a source document. If you can't prove it, it didn't happen. A 2-hour prep saves 2 days of audit stress.",
            quiz: [
              { q: "Auditor finds unvouched expense. Your response?", opts: ["Accept adjustment", "Find source document or accept adjustment", "Argue it's valid"], correct: 1 },
              { q: "Working papers should?", opts: ["Be minimal — less to check", "Show clear trail from source to final number", "Be complex to impress"], correct: 1 },
              { q: "Best audit preparation?", opts: ["Last-minute rush", "Monthly reconciliation and filing", "Hope auditor is lenient"], correct: 1 },
              { q: "Auditor requests documents you cannot locate. Your response?", opts: ["Tell auditor they do not exist", "Reconstruct from secondary evidence and disclose the gap", "Ignore the request and move on"], correct: 1 },
              { q: "Audit starts in 2 weeks. Your 3-priority checklist should be?", opts: ["Organise physical filing cabinets", "Reconcile bank, clear outstanding journals, index all source documents", "Wait — auditors do all the work"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Cash Flow Forecasting",
            notes: "Profit is opinion. Cash is fact. A business can be profitable and bankrupt simultaneously. Forecast 13 weeks ahead — that's one quarter. Seasonal businesses need 6-month views. Update weekly. The first sign of trouble is always in cash flow, not profit.",
            quiz: [
              { q: "Profitable company goes bankrupt. How?", opts: ["Impossible", "Cash tied in stock/debtors, can't pay suppliers", "Tax too high"], correct: 1 },
              { q: "Cash flow forecast horizon?", opts: ["1 week", "13 weeks (quarterly)", "1 year"], correct: 1 },
              { q: "First cash flow warning sign?", opts: ["Loss on income statement", "Delayed supplier payments or rising overdraft", "Employee complaints"], correct: 1 },
              { q: "13-week forecast shows a critical cash gap at week 9. When to act?", opts: ["When week 9 arrives", "In week 3 — arrange overdraft or accelerate debtor collections now", "Ignore forecasts — they're never accurate"], correct: 1 },
              { q: "Client says 'sales are great' but cash is always tight. Most likely cause?", opts: ["Customers stealing product", "Selling on credit without collecting — debtors balloon", "Bank fees are too high"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "Forensic Accounting instincts",
            notes: "Fraud leaves footprints. Round numbers at odd times. Duplicate invoices. Expenses just below approval thresholds. A forensic eye saves companies millions. Learn the red flags: lifestyle beyond salary, reluctance to take leave, defensive about records.",
            quiz: [
              { q: "Employee's lifestyle exceeds salary significantly. Red flag?", opts: ["None — maybe family money", "Possible fraud indicator — investigate discreetly", "Definitely fraud — fire immediately"], correct: 1 },
              { q: "Duplicate invoice amounts just below approval limit suggests?", opts: ["Efficient purchasing", "Splitting to avoid scrutiny — fraud pattern", "Smart budgeting"], correct: 1 },
              { q: "Forensic accountant's primary skill?", opts: ["Math genius", "Pattern recognition and skepticism", "IT hacking"], correct: 1 },
              { q: "An employee always processes their own expense reimbursements. Red flag?", opts: ["Efficient — no approval delay", "Segregation of duties failure — door wide open for fraud", "Sign of strong performance"], correct: 1 },
              { q: "Expense claims are always exact round numbers (R5,000, R10,000). Significance?", opts: ["Convenient — easy to process", "Possible fabricated entries — real expenses are rarely round", "Nothing unusual about it"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "law",
        name: "Legal Expert",
        desc: "Contracts, compliance & risk architecture",
        startCash: 15000,
        icon: "⚖️",
        assets: ["BOND", "REAL", "ENDOW"],
        tagline: "The law is your leverage",
        color: "#8E44AD",
        modules: [
          {
            id: 1,
            name: "Contract Architecture",
            notes: "A contract is a pre-agreed dispute resolution. Define deliverables, timelines, payment terms, and breach consequences. Ambiguity = litigation. The best contract is one you'll never need to enforce — because clarity prevented the fight.",
            quiz: [
              { q: "Contract says 'reasonable time' for delivery. Risk?", opts: ["None — standard term", "Ambiguity leads to disputes", "Faster delivery"], correct: 1 },
              { q: "Most important contract clause?", opts: ["Price", "Termination and dispute resolution", "Signatures"], correct: 1 },
              { q: "Verbal agreement with long-term client. Safe?", opts: ["Yes — trust", "No — memory fades, put it in writing", "Sometimes"], correct: 1 },
              { q: "Contract signed but no date specified. Legal effect?", opts: ["Void — unenforceable without a date", "Effective from signature, but delivery timing is uncertain", "SARS determines the effective date"], correct: 1 },
              { q: "Client wants to add oral terms to an existing written contract. Your advice?", opts: ["Fine — verbal terms are binding in SA too", "Amend the written contract — oral additions to written agreements are risky", "Both forms carry equal legal weight always"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Intellectual Property Monetization",
            notes: "Your legal templates, your compliance checklists, your contract clauses — these are intellectual property. License them. Create subscription legal toolkits. A R2,000/month subscription from 100 small businesses = R200,000/month recurring revenue.",
            quiz: [
              { q: "A contract template you wrote has value. How monetize?", opts: ["Use once per client", "License as template subscription", "Give away free"], correct: 1 },
              { q: "IP protection for legal documents?", opts: ["Copyright", "Patent", "Trademark"], correct: 0 },
              { q: "Recurring revenue from legal IP vs hourly billing?", opts: ["Less money", "Scales without your time — wealth builder", "Same thing"], correct: 1 },
              { q: "A competitor copies your legal template almost exactly. Your recourse?", opts: ["None — you can't copyright legal documents", "Copyright infringement claim if original authorship can be proven", "Trademark action is the correct route"], correct: 1 },
              { q: "You license templates to 50 firms. One shares them externally. Clause needed in future?", opts: ["Non-disclosure only", "Non-sublicensing clause with clear financial penalties", "Nothing — trust your clients"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Compliance as Competitive Edge",
            notes: "Companies that are compliance-ready win government tenders. B-BBEE, tax clearance, CIPC filings — these are barriers to entry for your competition. Maintain 100% compliance status. It's not a cost center, it's a qualification center.",
            quiz: [
              { q: "B-BBEE certificate is?", opts: ["Optional nice-to-have", "Required for many tenders and large contracts", "Only for big companies"], correct: 1 },
              { q: "Tax clearance expires. Check frequency?", opts: ["Yearly", "Before every major tender application", "Never — once valid always valid"], correct: 1 },
              { q: "Compliance cost vs tender value?", opts: ["Always a waste", "Investment — opens doors to R10M+ contracts", "Break-even only"], correct: 1 },
              { q: "B-BBEE certificate expired 2 weeks before tender submission. Options?", opts: ["Submit anyway and explain in covering letter", "Fast-track renewal immediately — no grace period allowed", "Use the expired certificate"], correct: 1 },
              { q: "POPIA compliance for a law firm specifically includes?", opts: ["Nothing — lawyers are exempt from POPIA", "Consent mechanisms, access logs, and breach notification procedures", "Just adding a privacy policy to the website"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Risk & Liability Shielding",
            notes: "Personal liability can take your house. Structure: Company (Pty) Ltd separates business from personal. Insurance covers what structure can't. Never sign personal surety without legal review. One bad contract can bankrupt a lawyer.",
            quiz: [
              { q: "Sole proprietor vs Pty Ltd for liability?", opts: ["Same", "Pty Ltd limits personal liability", "Sole proprietor is safer"], correct: 1 },
              { q: "Personal surety on business loan means?", opts: ["Nothing serious", "Your personal assets at risk if business fails", "Lower interest rate"], correct: 1 },
              { q: "Professional indemnity insurance covers?", opts: ["Office theft", "Mistakes that cost clients money", "Employee injuries"], correct: 1 },
              { q: "Sole proprietor attorney takes on a R10M matter and loses due to negligence. Personal exposure?", opts: ["Limited to R1M by law", "Unlimited — personal assets are fully at risk", "Professional insurance covers everything automatically"], correct: 1 },
              { q: "Client signs personal surety on a loan you advised on, didn't fully understand. Your exposure?", opts: ["None — they signed the document", "Potential professional negligence claim for failing to explain adequately", "Client's problem entirely"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Attorney to Rainmaker",
            notes: "A senior associate bills R3,000/hour. A partner brings in R3,000,000 in new client revenue. Rainmakers own the firm. Build relationships before you need them. Every coffee meeting is an investment. Your network is your net worth.",
            quiz: [
              { q: "Billable hours vs business development?", opts: ["Billable hours always", "Rainmaking (clients) builds equity and wealth", "Same value"], correct: 1 },
              { q: "Best rainmaking activity for a young attorney?", opts: ["Billing more hours", "Speaking at industry events, writing articles", "Waiting for referrals"], correct: 1 },
              { q: "A client relationship built over 3 years is worth?", opts: ["One matter fee", "Lifetime value: referrals, repeat business, reputation", "Nothing if they leave"], correct: 1 },
              { q: "You spend 5 hours writing a legal article instead of billing. ROI?", opts: ["Zero — you lost R15,000 in billing time", "Potential: speaking invites, publications, new clients worth millions", "Break-even at best"], correct: 1 },
              { q: "Senior partner offers referrals if you join his golf club at R5,000/month. ROI analysis?", opts: ["Too expensive — cut the cost", "One R100,000 brief pays 20 months of membership — worth calculating", "Never join — unprofessional"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "medical",
        name: "Medical Professional",
        desc: "Practice management, medical aids & malpractice shields",
        startCash: 18000,
        icon: "🏥",
        assets: ["BOND", "STOCK", "REAL"],
        tagline: "Heal patients, build empires",
        color: "#C0392B",
        modules: [
          {
            id: 1,
            name: "Practice Cash Flow Cycles",
            notes: "Medical aids pay in 30-90 days. Patients pay today. A practice that's 80% medical aid can starve while profitable. Balance: 60% medical aid (volume), 40% cash/private (speed). Build a cash buffer of 3 months operating expenses.",
            quiz: [
              { q: "Medical aid pays in 60 days. Monthly overhead is R80,000. Minimum buffer?", opts: ["R80,000", "R240,000 (3 months)", "R40,000"], correct: 1 },
              { q: "80% medical aid, 20% cash practice. Problem?", opts: ["None — medical aid is reliable", "Cash flow lag — too much waiting for payment", "Too much cash risk"], correct: 1 },
              { q: "Patient pays cash but wants to claim from medical aid themselves. You?", opts: ["Refuse — too complex", "Provide invoice, let them handle claim — cash today", "Do the claim for free"], correct: 1 },
              { q: "You're 80% medical aid. To fix cash flow, what is the first action?", opts: ["Add 20% cash patients immediately", "Identify which aid schemes have the shortest payment cycles", "Cut all operating costs"], correct: 1 },
              { q: "Practice revenue R300K/month. 3-month buffer needed. Saving R30K/month. Time to build?", opts: ["3 months", "30 months", "9 months at R30K/month to reach R270K"], correct: 2 }
            ]
          },
          {
            id: 2,
            name: "Medical Aid Tariff Mastery",
            notes: "Tariffs are negotiated, not given. Join networks strategically. Some networks bring volume but cut rates by 40%. Calculate: (Volume increase) × (Reduced rate) vs (Lower volume) × (Full rate). The math decides, not the sales pitch.",
            quiz: [
              { q: "Network offers 30% more patients at 25% lower tariff. Net revenue?", opts: ["Up 5%", "Down — 1.30 × 0.75 = 97.5% of original", "Up 30%"], correct: 1 },
              { q: "Tariff negotiation best approach?", opts: ["Accept first offer", "Benchmark against peers and negotiate up", "Reject all networks"], correct: 1 },
              { q: "Cash practice vs network practice?", opts: ["Always cash", "Hybrid — cash for speed, network for volume", "Always network"], correct: 1 },
              { q: "Aid pays 85% of your tariff. Write-off impact on R2M annual revenue?", opts: ["R30,000", "R300,000 — significant margin compression", "R200,000"], correct: 1 },
              { q: "Hospital network: 40% more patients at 20% lower rate. Net revenue change?", opts: ["Down — lower rate always hurts", "Up 12% — 1.40 × 0.80 = 1.12 of current revenue", "Break-even exactly"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Malpractice & indemnity",
            notes: "Malpractice claims can reach R50M. Indemnity is not optional. But premiums vary 3x between providers. Shop annually. Risk management lowers premiums: informed consent, proper notes, peer review. A R200,000 premium is cheaper than one claim.",
            quiz: [
              { q: "Malpractice indemnity premium is R180,000/year. One claim could be?", opts: ["Same amount", "R5M-R50M — premium is cheap protection", "R10,000"], correct: 1 },
              { q: "Best way to lower indemnity premiums?", opts: ["Lie about procedures", "Strong risk management: notes, consent, protocols", "Switch jobs"], correct: 1 },
              { q: "Informed consent in writing primarily protects?", opts: ["The patient only", "Both patient and practitioner legally", "The hospital only"], correct: 1 },
              { q: "Patient threatens social media exposure unless you waive their bill. Action?", opts: ["Waive — reputation is worth more", "Refuse and document — capitulating invites repeat threats", "Pay them to stay quiet"], correct: 1 },
              { q: "Indemnity premium renews 25% higher. Your response?", opts: ["Accept — it's mandatory so no choice", "Get three competing quotes first, then negotiate current provider", "Switch blindly to the cheapest option"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Equipment & Property Levers",
            notes: "That R1.2M MRI. Lease it, don't buy it — technology obsoletes in 5 years. Property? Buy the building if practice is established 5+ years. Rent is an expense. Mortgage builds equity. Your rooms are your retirement fund.",
            quiz: [
              { q: "R1.2M medical equipment with 5-year tech life. Buy or lease?", opts: ["Buy — asset", "Lease — avoid obsolescence risk", "Either is same"], correct: 1 },
              { q: "Renting practice rooms for 10 years vs buying building?", opts: ["Renting — flexibility", "Buying — payments build equity, rent is lost", "Same cost"], correct: 1 },
              { q: "Property as retirement strategy for doctors?", opts: ["Poor — too risky", "Excellent — practice building appreciates + rental income", "Only for specialists"], correct: 1 },
              { q: "Practice lease up for renewal — landlord wants 40% more. Best response?", opts: ["Accept — moving disrupts patient flow", "Research market rentals now and negotiate hard or plan exit", "Wait until the final month to decide"], correct: 1 },
              { q: "You buy the practice building. Mortgage R45K/month vs rent R35K/month. Extra R10K?", opts: ["Wasted money", "Equity building — own the asset outright after 20 years", "Goes entirely to interest"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Doctor to Healthcare CEO",
            notes: "One practice = a job. Three practices = a business. A hospital group = an empire. But delegation is the challenge. Hire a practice manager when you have 2+ rooms. Your clinical time is worth R3,000+/hour. Admin is worth R200/hour. Delegate.",
            quiz: [
              { q: "Doctor earns R3,500/hr clinically. Admin takes 10 hrs/week. Cost?", opts: ["Nothing — do it yourself", "R35,000/week in lost clinical income", "R2,000/week"], correct: 1 },
              { q: "When to hire a practice manager?", opts: ["Day 1", "2+ rooms or when admin exceeds 8 hrs/week", "Never — do it yourself"], correct: 1 },
              { q: "Healthcare empire building requires?", opts: ["More degrees", "Systems, delegation, and business skills", "Just more patients"], correct: 1 },
              { q: "You hire a practice manager. Revenue rises 20% on R200K base. Manager costs R25K. Net gain?", opts: ["Break-even — R25K in, R25K out", "R15K net gain (R40K extra revenue - R25K salary)", "A loss — not worth it"], correct: 1 },
              { q: "You manage three practices but still review all admin personally. Main bottleneck?", opts: ["Normal for this growth phase", "You — delegate or the system breaks at this scale", "Staff shortage in all locations"], correct: 1 }
            ]
          }
        ]
      }
    ]
  },
  corporate: {
    name: "Corporate Professional",
    mindsets: [
      {
        id: "restaurant",
        name: "Restaurateur",
        desc: "High-end dining & food cost percentage mastery",
        startCash: 50000,
        icon: "🍽️",
        assets: ["FOOD", "EQUIP", "REAL"],
        tagline: "Where cuisine meets capitalism",
        color: "#E67E22",
        modules: [
          {
            id: 1,
            name: "The Food Cost Formula",
            notes: "Fine dining targets 28-32% food cost. Casual dining 25-30%. If your wagyu dish costs R180 to make and sells for R450, you're at 40% — bleeding margin. Renegotiate with suppliers, redesign the plate, or raise the price. Math is your sous-chef.",
            quiz: [
              { q: "Dish costs R120, sells for R400. Food cost %?", opts: ["25%", "30%", "40%"], correct: 1 },
              { q: "Food cost target for fine dining?", opts: ["15%", "28-32%", "50%"], correct: 1 },
              { q: "Wagyu cost rises 30%. Your options?", opts: ["Absorb it — reputation matters", "Renegotiate, redesign, or reprice", "Remove from menu"], correct: 1 },
              { q: "A seasonal ingredient triples in price mid-menu cycle. Response?", opts: ["Keep the dish — exclusivity matters", "Substitute or create a seasonal variation and communicate to guests", "Remove the dish permanently"], correct: 1 },
              { q: "Which daily habit best reduces food cost surprises in a restaurant?", opts: ["Monthly stocktake only", "Daily plate cost tracking with weekly supplier price checks", "Quarterly full audits"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Table Turn Economics",
            notes: "A 40-seat restaurant at 2 turns/night = 80 covers. At 3 turns = 120 covers. That's 50% more revenue with the same rent. Service speed, reservation management, and menu design drive turns. But never rush fine dining — turns must match experience promise.",
            quiz: [
              { q: "40 seats, 2 turns, R400 average cover. Revenue?", opts: ["R16,000", "R32,000", "R48,000"], correct: 1 },
              { q: "Increase from 2 to 2.5 turns. Revenue impact?", opts: ["10%", "25%", "50%"], correct: 1 },
              { q: "Fine dining vs fast casual turn strategy?", opts: ["Same — maximize turns", "Fine dining: fewer turns, higher cover. Casual: more turns, lower cover", "Always 3 turns"], correct: 1 },
              { q: "Valentine's Day: 2 turns with R150 surcharge on 40 covers. Extra revenue vs normal?", opts: ["R6,000", "R12,000 (2 turns × 40 covers × R150)", "R3,000"], correct: 1 },
              { q: "30% no-show rate on Fridays. Best structural fix?", opts: ["Accept it as industry normal", "Credit card pre-authorisation or cancellation fee policy", "Overbook by 30% and risk conflict"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Wine List as Profit Engine",
            notes: "Wine margins: 60-75%. A R200 bottle cost you R60. Wine sales can be 30% of revenue. Train staff to upsell. A R450 bottle suggestion vs R280 house wine adds R170 × 20 tables = R3,400 extra per night. That's R1M+ annually.",
            quiz: [
              { q: "Wine costs R80, sells for R280. Margin %?", opts: ["28%", "71%", "50%"], correct: 1 },
              { q: "Staff upsells wine from R280 to R450 average. 20 tables/night. Extra revenue?", opts: ["R1,700", "R3,400", "R5,000"], correct: 1 },
              { q: "Wine list should have how many options?", opts: ["As many as possible", "Curated 40-60 — manageable for staff and guests", "Only 5"], correct: 1 },
              { q: "Wine by the glass program wastes 30% of each bottle opened. Best fix?", opts: ["Remove by-the-glass option entirely", "Nitrogen preservation system extends open bottles 7+ days", "Charge the same price regardless"], correct: 1 },
              { q: "Sommelier upsells wine 40% of nights. 80 covers/night, avg R200 upsell. Monthly extra revenue?", opts: ["R64,000", "R192,000 (80 × 40% × R200 × 30 nights)", "R48,000"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Labour Cost in Hospitality",
            notes: "Labour should be 25-35% of revenue in restaurants. Overtime kills profit — schedule smart. Cross-train staff: a server who can bartend saves a salary. Peak staffing, valley flexibility. Labour is your largest controllable cost.",
            quiz: [
              { q: "Monthly revenue R400,000. Labour target?", opts: ["R100,000-R140,000", "R200,000", "R50,000"], correct: 0 },
              { q: "Cross-training staff means?", opts: ["They can do multiple roles — staffing flexibility", "They leave for better jobs", "Higher pay for everyone"], correct: 0 },
              { q: "Overtime at 1.5x rate. When justified?", opts: ["Never — hire more staff", "When short-term demand spike exceeds hiring cost", "Always — shows hard work"], correct: 1 },
              { q: "5 kitchen staff, shift runs 30 min over at 2x rate, base R120/hr. Total overtime cost?", opts: ["R60 total", "R300 total (5 staff × R120 × 0.5 hr × 1x extra)", "R600 total"], correct: 1 },
              { q: "Cross-trained bartender covers sick server. Primary savings?", opts: ["None — service is disrupted anyway", "Temp agency fee avoided (~R450/shift) plus consistent guest experience", "Minimal — barely worth noting"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "The Michelin Mindset",
            notes: "A Michelin star can increase revenue 40-60%. But the cost of maintaining it is extreme. Calculate ROI: (Revenue increase - Cost increase) / Investment. Some restaurants voluntarily return stars to focus on profit. Prestige has a price — know yours.",
            quiz: [
              { q: "Michelin star increases revenue 50% but costs rise 45%. Worth it?", opts: ["Yes — prestige", "Marginally — 5% net gain, consider brand value too", "No — too expensive"], correct: 1 },
              { q: "Maintaining Michelin standards requires?", opts: ["Better ingredients only", "Consistent excellence in every detail + higher costs", "Marketing budget"], correct: 1 },
              { q: "A restaurant returns a Michelin star. Reason?", opts: ["Failure", "Strategic focus on profitability over prestige", "Lost chef"], correct: 1 },
              { q: "Your restaurant may be reviewed anonymously this month. Best preparation?", opts: ["Train staff specifically for VIP visits", "Maintain identical quality every single service — inspectors visit unannounced", "Run a special showcase menu during review season"], correct: 1 },
              { q: "Michelin visits 1-2 times per year. How to calculate ROI of ongoing prep costs?", opts: ["Not worth calculating — it's about prestige only", "Annual extra revenue from star × years held, divided by annual prep costs", "Calculate monthly — too granular"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "salon",
        name: "Salon Owner",
        desc: "Service business & recurring revenue architecture",
        startCash: 30000,
        icon: "✂️",
        assets: ["PRODUCT", "RENTAL", "EQUIP"],
        tagline: "Style is currency",
        color: "#8E44AD",
        modules: [
          {
            id: 1,
            name: "The Chair Rental Model",
            notes: "Rent chairs to stylists at R3,000/month each. 6 chairs = R18,000 fixed income. You provide space, power, reception. They bring clients and tools. Lower risk than employees — no UIF, no leave, no overtime. But quality control is harder.",
            quiz: [
              { q: "6 chairs at R3,500/month. Fixed monthly income?", opts: ["R18,000", "R21,000", "R15,000"], correct: 1 },
              { q: "Chair rental vs employed stylists. Your risk?", opts: ["Higher — no control", "Lower — no employment obligations", "Same"], correct: 1 },
              { q: "Chair renters leave. Your revenue?", opts: ["Goes to zero immediately", "Drops but space can be re-rented", "Stays same"], correct: 1 },
              { q: "A chair renter uses your salon name in marketing but delivers inconsistent quality. Issue?", opts: ["Free marketing — welcome it", "Brand inconsistency — their quality reflects directly on your reputation", "No issue unless clients complain"], correct: 1 },
              { q: "Chair renter earns R60K/month in your salon. You charge R3,500 flat. Right model?", opts: ["Yes — low risk guaranteed income", "Consider a percentage model (10-15%) — better aligned as they grow", "Raise flat fee immediately to R10K"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Retail Product Margins",
            notes: "Services pay rent. Retail products build wealth. Salon products: 40-60% margin. A R400 shampoo costs you R160. Sell 10/day = R2,400 profit. That's R50,000/month from product alone. Train every stylist to recommend. No recommendation = lost profit.",
            quiz: [
              { q: "Product sells for R350, costs R140. Margin?", opts: ["40%", "60%", "50%"], correct: 1 },
              { q: "10 product sales/day. Average margin R200/product. Monthly product profit?", opts: ["R20,000", "R60,000 (20 work days)", "R40,000"], correct: 1 },
              { q: "Stylist doesn't push retail. Impact?", opts: ["None — focus on service", "Massive lost profit — retail is pure margin", "Minor — some customers buy anyway"], correct: 1 },
              { q: "Retail products expire in 18 months. You overordered — R20K stock with 3 months to expiry. Action?", opts: ["Write it off entirely", "50% sale event — recover R10K rather than R0", "Try to return to supplier at full price"], correct: 1 },
              { q: "Stylist sells retail without informing you and no commission agreement exists. Fix?", opts: ["Trust them — they're selling more", "Implement per-stylist retail tracking with a shared commission structure", "Fire them immediately"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Membership & Recurring Revenue",
            notes: "R400/month unlimited trims. 100 members = R40,000 guaranteed monthly. Predictable revenue lets you plan inventory and staff. The key: members must feel value. 70% utilization is break-even. Above 70% = profit. Design packages carefully.",
            quiz: [
              { q: "100 members at R450/month. Guaranteed monthly revenue?", opts: ["R40,000", "R45,000", "R35,000"], correct: 1 },
              { q: "Membership break-even at 70% utilization means?", opts: ["70% of members use service", "If 70%+ use it, you profit", "Only 70% can join"], correct: 1 },
              { q: "Membership model risk?", opts: ["None — guaranteed money", "Over-utilization kills margin, under-utilization kills reputation", "Too complex"], correct: 1 },
              { q: "Member uses 12 trims in one month at R400 package. Each trim costs R200 in labour. Your margin?", opts: ["R4,800 profit — all goes to you", "Loss — R2,400 labour cost exceeds R400 package revenue", "Need more information to calculate"], correct: 1 },
              { q: "100 members cancel in month 2. Root cause investigation should first check?", opts: ["Assume they moved away", "Service quality complaints, value perception, and competing pricing", "Nothing — monthly churn is normal"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Appointment Density",
            notes: "A stylist doing 4 cuts/day at R200 = R800. At 6 cuts/day = R1,200. That's 50% more with the same rent and base pay. Optimize: online booking reduces no-shows by 30%. SMS reminders = filled gaps. An empty chair is a crime against profit.",
            quiz: [
              { q: "Stylist: 4 cuts/day at R250. Add 2 more cuts. Revenue increase?", opts: ["R250", "R500/day = R10,000/month", "R125"], correct: 1 },
              { q: "No-shows are 20% of bookings. SMS reminders reduce by?", opts: ["5%", "30% — huge revenue recovery", "50%"], correct: 1 },
              { q: "Online booking vs phone booking?", opts: ["Same", "Online: 24/7, reduces no-shows, fills gaps automatically", "Phone is more personal"], correct: 1 },
              { q: "8am-10am is consistently empty. Strategy to fill those slots?", opts: ["Keep as buffer time for walk-ins", "Early-bird R150 discount for 8-9am bookings — incentivize off-peak", "Open the salon later instead"], correct: 1 },
              { q: "Booking system costs R800/month. Reduces 4 no-shows/week at R250 avg value. Monthly net gain?", opts: ["R1,000 gain", "R3,200 net (R4,000 recovered - R800 system cost)", "Break-even only"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "Scaling to Academy & Franchise",
            notes: "Your salon trains stylists. Your academy charges R15,000/student. 20 students = R300,000. Your franchise model: R150,000 setup fee + 5% royalty. That's R750,000 + ongoing. The brand you built becomes the asset you sell.",
            quiz: [
              { q: "Academy: 20 students at R15,000. Revenue?", opts: ["R200,000", "R300,000", "R150,000"], correct: 1 },
              { q: "Franchise fee R150k + 5% royalty on R2M/year revenue. Annual income per franchise?", opts: ["R150,000", "R250,000", "R100,000"], correct: 1 },
              { q: "Franchise model requires?", opts: ["Just a logo", "Systems, training, brand consistency, legal framework", "More salons owned first"], correct: 1 },
              { q: "Franchisee opens their salon using different product brands. Your action?", opts: ["Allow it — their salon, their choice", "Enforce brand standards clause in the franchise agreement", "Terminate agreement immediately without warning"], correct: 1 },
              { q: "Academy: costs R8K per student, charges R15K, 20 students. Total margin?", opts: ["R300,000 revenue", "R140,000 margin (R7K × 20 students)", "R160,000 margin"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "logistics",
        name: "Logistics Director",
        desc: "Supply chain, fleet & freight optimization",
        startCash: 80000,
        icon: "🚛",
        assets: ["TRANS", "MACHINE", "EXPORT"],
        tagline: "Move the world, own the margin",
        color: "#2980B9",
        modules: [
          {
            id: 1,
            name: "Route Optimization Algorithms",
            notes: "Fuel is 35% of logistics cost. Optimized routes save 15-25% in fuel. GPS + load consolidation = fewer empty kilometres. A truck running empty is burning profit. Multi-drop planning turns one trip into three revenues.",
            quiz: [
              { q: "Monthly fuel bill R120,000. Route optimization saves 20%. Savings?", opts: ["R12,000", "R24,000", "R36,000"], correct: 1 },
              { q: "Empty kilometres are?", opts: ["Normal cost", "Pure loss — no revenue, only fuel and wear", "Tax deductible"], correct: 1 },
              { q: "Multi-drop planning means?", opts: ["Multiple drivers", "One trip, multiple deliveries = revenue per km", "Multiple trucks"], correct: 1 },
              { q: "GPS shows a driver's route is 20km longer than optimal. Fuel costs R25/km. Monthly loss?", opts: ["R500 lost", "R15,000 lost (20km × R25 × 30 days)", "R5,000 lost"], correct: 1 },
              { q: "Load shedding disrupts warehouse operations. Contingency plan for deliveries?", opts: ["Cancel deliveries for that day", "Generator backup + reschedule critical loads + notify clients proactively", "Claim force majeure on all affected deliveries"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Fleet Financing & Depreciation",
            notes: "A R1.5M truck depreciates R300,000/year. That's R25,000/month in hidden cost. Lease if technology changes (electric coming). Buy if you run 80%+ utilization. Calculate total cost of ownership: purchase + fuel + maintenance + insurance - residual value.",
            quiz: [
              { q: "R1.5M truck, 5-year life, zero residual. Monthly depreciation?", opts: ["R15,000", "R25,000", "R30,000"], correct: 1 },
              { q: "Electric trucks coming in 3 years. Current fleet strategy?", opts: ["Buy diesel now", "Lease to preserve transition flexibility", "Wait — do nothing"], correct: 1 },
              { q: "Total Cost of Ownership includes?", opts: ["Purchase price only", "Purchase + running costs - residual value", "Fuel only"], correct: 1 },
              { q: "Truck financed at 15% interest. You could earn 12% on that cash in savings. True net cost of debt?", opts: ["15% — the stated interest rate", "3% net — opportunity cost offset means actual cost is the difference", "15% is always correct — never lower"], correct: 1 },
              { q: "Fleet manager claims 90% utilization. GPS data shows 65%. Action?", opts: ["Accept the manager's view — he knows the fleet", "Investigate — a 25% gap is material and could signal idle time or data fraud", "Fire the manager immediately"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Warehouse Cost Engineering",
            notes: "Rent per square meter is fixed. Revenue per square meter is variable. Warehouse layout determines pick speed. A well-designed warehouse reduces labour cost 20%. Vertical space, zone picking, and barcode systems turn storage into profit.",
            quiz: [
              { q: "Warehouse rent is R40,000/month. You improve layout, reduce pick time 30%. Effect?", opts: ["Rent drops", "Same rent, more orders fulfilled = higher revenue/sqm", "Labour cost rises"], correct: 1 },
              { q: "Zone picking means?", opts: ["Different zones for different customers", "Workers stay in zones, pickers pass orders — efficiency", "Delivery zones only"], correct: 1 },
              { q: "Vertical warehouse space utilization?", opts: ["Dangerous — keep it low", "Essential — rent is 2D, storage is 3D", "Only for light items"], correct: 1 },
              { q: "Peak demand needs 14,000 units but your warehouse holds 10,000. Solution?", opts: ["Turn away those customers", "Overflow contract with a 3PL provider for peak season only", "Rent a bigger warehouse permanently"], correct: 1 },
              { q: "Fire destroys 30% of stored client inventory. Do you have business interruption insurance?", opts: ["Not needed — standard fire cover is enough", "Critical — covers stock value, lost revenue, and recovery costs", "Only large warehouses need it"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Cross-Border & Customs",
            notes: "Import duties, VAT, and customs delays kill margins. A 2-day customs delay costs R5,000 in storage + lost sales. Use bonded warehouses. Pre-clear documentation. Build relationships with clearing agents. Speed is money in logistics.",
            quiz: [
              { q: "2-day customs delay costs R5,000. 50 shipments/year affected. Annual cost?", opts: ["R5,000", "R250,000", "R50,000"], correct: 1 },
              { q: "Bonded warehouse benefit?", opts: ["Free storage", "Defer duty payment until goods leave warehouse", "No VAT"], correct: 1 },
              { q: "Best customs strategy?", opts: ["Hope for fast clearance", "Pre-clear, bonded storage, trusted agent relationships", "Bribe officials"], correct: 1 },
              { q: "A new tariff applies to your product category. Ideal discovery time?", opts: ["When your next shipment is delayed", "Proactively — subscribe to ITAC and SARS tariff change notifications", "Wait for clearing agent to flag it"], correct: 1 },
              { q: "R250,000 import duties due on arrival. Cash flow solution?", opts: ["Cancel the entire shipment", "Bonded warehouse — store goods and defer duty until goods leave", "Take an emergency loan at any rate"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "4PL & Digital Logistics",
            notes: "Fourth-party logistics (4PL) manages your entire supply chain digitally. Margins: 5-8% of freight value. At R50M freight under management = R2.5M-R4M revenue. Build a digital platform. Data is the new freight.",
            quiz: [
              { q: "4PL margin is 6% on R80M managed freight. Revenue?", opts: ["R400,000", "R4.8M", "R8M"], correct: 1 },
              { q: "Digital platform in logistics does?", opts: ["Looks modern", "Optimizes routes, tracks, predicts — margin multiplier", "Replaces drivers"], correct: 1 },
              { q: "Data in logistics is valuable because?", opts: ["Regulatory requirement", "Predicts demand, optimizes inventory, reduces waste", "IT department needs work"], correct: 1 },
              { q: "Client wants real-time shipment tracking. You don't have the system. Build or buy?", opts: ["Always build — custom is always better", "Subscribe first (R5-15K/month), build only when scale justifies it", "Clients don't really need tracking"], correct: 1 },
              { q: "Your top 3 clients represent 70% of revenue. Risk management priority?", opts: ["Celebrate — loyal clients are the goal", "Concentration risk — actively develop 5+ more clients to diversify", "Nothing to change — loyalty is an asset"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "ecommerce",
        name: "E-commerce CEO",
        desc: "Online retail, LTV/CAC ratios & digital scaling",
        startCash: 60000,
        icon: "🛒",
        assets: ["TECH", "IPO", "BOND"],
        tagline: "Clicks that convert to cash",
        color: "#1ABC9C",
        modules: [
          {
            id: 1,
            name: "The LTV/CAC Golden Ratio",
            notes: "Lifetime Value (LTV) must be 3x+ Customer Acquisition Cost (CAC). If you spend R300 to acquire a customer who spends R900 over their lifetime, you're at 3x. Below 3x = unsustainable. Above 5x = scale aggressively.",
            quiz: [
              { q: "CAC is R250. Minimum healthy LTV?", opts: ["R250", "R750+", "R500"], correct: 1 },
              { q: "LTV/CAC at 2x. Action?", opts: ["Scale marketing", "Fix unit economics first — unsustainable", "Raise prices 50%"], correct: 1 },
              { q: "LTV/CAC at 6x. Action?", opts: ["Cut marketing — too expensive", "Scale aggressively — unit economics are strong", "Raise CAC to 10x"], correct: 1 },
              { q: "You spend R300 acquiring a customer who buys once at R400. LTV/CAC ratio?", opts: ["Above 3x — healthy to scale", "1.3x — below threshold, fix economics before scaling", "Exactly at 3x — fine to proceed"], correct: 1 },
              { q: "CAC rises 40% due to iOS privacy changes. Best response?", opts: ["Accept it — digital advertising costs always rise", "Diversify: invest in SEO, email, referrals to reduce Meta dependency", "Stop all paid marketing"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Cart Abandonment Recovery",
            notes: "70% of carts are abandoned. A 3-email recovery sequence recovers 15-25%. Email 1: 'Forgot something?' (1 hour). Email 2: 'Still thinking?' + 10% off (24 hours). Email 3: 'Last chance' (72 hours). Each email costs R0.05. Revenue per email: R45.",
            quiz: [
              { q: "1,000 carts/month, 70% abandon. 500 recovered at 20% rate. Extra sales?", opts: ["70", "140", "100"], correct: 1 },
              { q: "Email recovery cost is R0.05/email. Revenue per recovery is R450. ROI?", opts: ["10x", "9,000x", "100x"], correct: 1 },
              { q: "Best cart abandonment email timing?", opts: ["Immediately", "1 hour, 24 hours, 72 hours — spaced persuasion", "1 week later"], correct: 1 },
              { q: "Recovery email 2 (24hrs, 10% discount) converts 15% of 1,000 abandoned carts at R500 avg. Extra revenue?", opts: ["R7,500", "R75,000 (1,000 × 15% × R500)", "R15,000"], correct: 1 },
              { q: "You offer a 10% discount in recovery email 1 (at 1 hour). The problem with this?", opts: ["Customers learn to abandon deliberately to receive the discount", "No problem — earlier is always better", "Discount should only be 5%"], correct: 0 }
            ]
          },
          {
            id: 3,
            name: "Inventory & Cash Flow",
            notes: "E-commerce cash is trapped in inventory. Fast movers: reorder at 30% stock. Slow movers: discount at 60% stock age. Dead stock is a corpse — bury it at 80% off and free the cash. Cash in stock is cash not in ads.",
            quiz: [
              { q: "R200,000 in dead stock. You discount 70%. Cash recovered?", opts: ["R140,000", "R60,000 — but cash is freed for working items", "R0"], correct: 1 },
              { q: "Fast-moving item at 30% stock. Action?", opts: ["Wait — might not sell", "Reorder now — avoid stockout", "Discount to clear"], correct: 1 },
              { q: "Cash tied in inventory means?", opts: ["Future profit", "Can't spend on marketing or new products", "Tax benefit"], correct: 1 },
              { q: "Product sits 90+ days unsold. Hold vs 40% discount?", opts: ["Hold — value will return", "Discount and liquidate — storage cost + tied cash exceeds 40% loss", "Destroy it for a tax write-off"], correct: 1 },
              { q: "Which inventory metric best predicts when to reorder?", opts: ["Days of stock remaining count", "Reorder point = lead time × average daily sales rate", "Monthly manual stocktake only"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Payment Gateway Optimization",
            notes: "Payment fees: 2.5-4% per transaction. On R1M revenue, that's R25,000-R40,000. Negotiate with gateways at volume. Offer EFT for large orders (1% vs 3.5%). Every 0.5% saved on R5M = R25,000 extra profit.",
            quiz: [
              { q: "R3M revenue. Gateway at 3.5% vs negotiated 2.8%. Annual savings?", opts: ["R7,000", "R21,000", "R35,000"], correct: 1 },
              { q: "EFT for large orders saves?", opts: ["Nothing — customers prefer cards", "1-2% per transaction on big orders", "Time only"], correct: 1 },
              { q: "Best payment strategy?", opts: ["One gateway only", "Multiple gateways: cards for speed, EFT for savings, credit for big orders", "Cash on delivery only"], correct: 1 },
              { q: "You receive a R200,000 single transaction. Gateway charges 3.5%. Fee amount?", opts: ["R3,500", "R7,000", "R700"], correct: 1 },
              { q: "Customer demands refund. Settlement already processed. Gateway charges a reversal fee. Who absorbs it?", opts: ["Always the gateway — their fee", "You do — factor reversal costs into your refund policy and pricing", "Always the customer"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "The Exit: IPO vs Acquisition",
            notes: "Your e-commerce empire. IPO: public listing, R500M+ valuation needed. Acquisition: strategic buyer pays 2-5x revenue. Build your data room now: financials, growth metrics, customer cohorts. The exit starts on day one.",
            quiz: [
              { q: "Strategic buyer pays 3x revenue. Your revenue is R20M. Valuation?", opts: ["R20M", "R60M", "R100M"], correct: 1 },
              { q: "IPO minimum valuation for JSE AltX?", opts: ["R10M", "R500M+", "R50M"], correct: 1 },
              { q: "Data room preparation should start?", opts: ["6 months before exit", "Day one — every record matters", "After offer received"], correct: 1 },
              { q: "Strategic buyer offers 4x revenue (R20M). Financial buyer offers 5x EBITDA (R3M). Which is more?", opts: ["Strategic at R80M — significantly more", "Financial at R15M — more favourable terms", "They are the same valuation"], correct: 0 },
              { q: "Building for acquisition. Best 24-month focus?", opts: ["Maximum revenue growth at all costs", "Predictable recurring revenue + clean financials + diversified client base", "Headcount reduction for margin"], correct: 1 }
            ]
          }
        ]
      }
    ]
  },
  wealthy: {
    name: "Wealth Builder",
    mindsets: [
      {
        id: "mining",
        name: "Mining Magnate",
        desc: "Commodities, geopolitics & resource economics",
        startCash: 2000000,
        icon: "⛏️",
        assets: ["RAW", "EXPORT", "CONGLOM"],
        tagline: "The earth yields to the patient",
        color: "#F1C40F",
        modules: [
          {
            id: 1,
            name: "Commodity Cycle Mastery",
            notes: "Commodities move in 7-10 year supercycles. Buy assets in the trough. Sell or develop in the peak. Platinum at R800/oz vs R2,400/oz is the same metal — different timing. The cycle is your friend if you respect it.",
            quiz: [
              { q: "Platinum at R900/oz. Historic peak was R2,400. Strategy?", opts: ["Sell — going lower", "Accumulate — cyclical low, patience pays", "Wait — no action"], correct: 1 },
              { q: "Supercycle length historically?", opts: ["1-2 years", "7-10 years", "20+ years"], correct: 1 },
              { q: "Buying at peak vs trough over 10 years?", opts: ["Same — time in market", "Trough buyers triple, peak buyers break even or lose", "Peak buyers win short-term"], correct: 1 },
              { q: "Platinum is at R2,400 (cycle peak) with 3-4 years remaining. Optimal action?", opts: ["Sell everything immediately — lock in the peak", "Sell 30-40% to lock in gains, retain the rest for further upside", "Hold all — peak not yet confirmed"], correct: 1 },
              { q: "Government increases royalty tax 5% on platinum. Your margin shrinks. Response?", opts: ["Close the mine — unviable", "Model full impact and explore embedding royalty hedging in contracts", "Ignore — mining companies are usually exempt"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "JSE vs Global Listings",
            notes: "Dual-listing on NYSE or LSE unlocks deeper capital pools. JSE mining investors are conservative. Global investors pay premium multiples. The cost: compliance, reporting, governance. The reward: 30-50% valuation premium.",
            quiz: [
              { q: "Dual-listing cost is R5M/year. Valuation premium 40% on R2B. Worth it?", opts: ["No — too expensive", "Yes — R800M value lift vs R5M cost", "Depends on CEO"], correct: 1 },
              { q: "Global investors vs JSE investors on mining?", opts: ["Same", "Global pay higher multiples, JSE more conservative", "JSE pays more"], correct: 1 },
              { q: "Dual-listing compliance burden?", opts: ["Minor — just more forms", "Major: SOX, IFRS, quarterly reporting, board structure", "None — automatic"], correct: 1 },
              { q: "JSE appetite is weak and you need to raise R500M. Best alternative?", opts: ["Wait for JSE conditions to improve", "Eurobond issue or pursue dual-listing to access deeper global capital", "Issue new shares at a significant discount"], correct: 1 },
              { q: "Post dual-listing, your company fails governance reporting requirements. Consequence?", opts: ["A small administrative fine", "Delisting risk + reputational damage + potential director liability", "Easier to resolve than JSE-only breaches"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "ESG & The Social Licence",
            notes: "Environmental, Social, Governance (ESG) is no longer optional. A mining company without ESG compliance can't raise capital. Community relations = social licence. Host communities must see benefit: jobs, schools, clinics. Without it, your mine closes.",
            quiz: [
              { q: "ESG non-compliance impact on capital?", opts: ["Minor — some investors care", "Critical — many funds can't invest without ESG", "None — profits matter"], correct: 1 },
              { q: "Social licence means?", opts: ["Government permit", "Community acceptance and benefit-sharing", "Media approval"], correct: 1 },
              { q: "ESG spending is?", opts: ["Wasted cost", "Insurance against shutdown + capital access enabler", "Marketing only"], correct: 1 },
              { q: "Community protests block mine access for 2 weeks. At R2M/day production loss, total impact?", opts: ["R2M — one day only", "R28M production loss + legal + community relationship repair costs", "You can always negotiate it down to nothing"], correct: 1 },
              { q: "Your largest institutional investor asks why you publish no ESG report. Consequence of not responding?", opts: ["Minor — they understand mining complexity", "Potential divestment — ESG disclosure is now a mandatory investment screen for major funds", "Actually positive — protects competitive trade secrets"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Hedging Currency & Price",
            notes: "Rand/dollar volatility can erase commodity gains. Forward contracts lock in exchange rates. Futures lock in commodity prices. Hedging is insurance, not speculation. A 15% rand swing on R100M revenue = R15M. Hedge 70% of predictable revenue.",
            quiz: [
              { q: "R100M revenue, rand drops 15%. Unhedged loss?", opts: ["R5M", "R15M", "R0"], correct: 1 },
              { q: "Hedging 70% of predictable revenue means?", opts: ["Guaranteed loss", "Protected core, upside on 30%", "No risk at all"], correct: 1 },
              { q: "Forward contract vs futures?", opts: ["Same thing", "Forward: customized OTC. Futures: standardized exchange", "Both illegal"], correct: 1 },
              { q: "You hedged 70% of revenue at R18/USD. Rand strengthens to R15/USD. Unhedged 30% impact?", opts: ["Gain — stronger rand helps", "Loss — same USD amount converts to fewer rand at R15", "No impact on the unhedged portion"], correct: 1 },
              { q: "Why would a mining company prefer an OTC forward contract over exchange-traded futures?", opts: ["Forwards are always cheaper", "Customized amount and settlement date — matches exact production schedule", "Futures contracts are illegal in South Africa"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Pit to Platform",
            notes: "Mining extracts wealth. Technology multiplies it. Ore sorting AI increases yield 20%. Autonomous trucks cut labour cost 30%. The modern magnate invests in tech as heavily as drills. The mine that doesn't digitize will be bought by one that does.",
            quiz: [
              { q: "AI ore sorting increases yield 20%. On R500M ore value?", opts: ["R20M extra", "R100M extra", "R50M extra"], correct: 1 },
              { q: "Autonomous trucks cut labour 30%. Labour is R40M/year. Savings?", opts: ["R8M", "R12M", "R20M"], correct: 1 },
              { q: "Tech investment in mining is?", opts: ["Optional luxury", "Survival requirement — non-tech mines become targets", "Only for big mines"], correct: 1 },
              { q: "AI sorting increases ore yield 20% on R200M ore value. Installation costs R50M. Payback period?", opts: ["1 year", "25 months (R50M ÷ R40M annual extra value)", "5 years"], correct: 1 },
              { q: "Autonomous trucks save R12M/year in labour but cost R5M/year in software maintenance. Net saving?", opts: ["R12M — full labour saving", "R7M net annual saving after software costs", "R5M — only the software cost matters"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "realestate",
        name: "Property Tycoon",
        desc: "Luxury real estate, REITs & development",
        startCash: 1500000,
        icon: "🏢",
        assets: ["PROPERTY", "REIT", "DEVELOP"],
        tagline: "They aren't making more land",
        color: "#E67E22",
        modules: [
          {
            id: 1,
            name: "Location Arbitrage",
            notes: "Buy where the train line is planned, not where it arrives. Urban regeneration zones: Cape Town CBD, Maboneng, Durban Point. Early entry: R8,000/sqm. Post-development: R25,000/sqm. Information is property profit.",
            quiz: [
              { q: "Buy at R8,000/sqm, sell at R25,000/sqm. Return on R800,000 unit?", opts: ["R1.7M profit", "R2.5M profit", "R800,000 profit"], correct: 0 },
              { q: "Best property information source?", opts: ["Social media", "City development plans, infrastructure budgets", "Estate agents"], correct: 1 },
              { q: "Urban regeneration risk?", opts: ["None — guaranteed", "Development might not happen, or takes 10+ years", "Too expensive"], correct: 1 },
              { q: "Infrastructure announcement boosts your property 15% before construction starts. You sell. Tax implication?", opts: ["None — property gains are tax-free in SA", "Capital Gains Tax applies — plan your exit around the inclusion rate", "Transfer duty applies again on the sale"], correct: 1 },
              { q: "An agent says the area is 'up and coming'. How do you verify?", opts: ["Trust the agent — they know the market", "Check municipal development plans, building plan approvals, and school ratings", "Use Google Street View comparisons"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "REIT vs Direct Ownership",
            notes: "REITs: liquid, diversified, 5-8% yield. Direct: illiquid, concentrated, 8-15% yield + capital growth. REITs for cash flow and liquidity. Direct for control and leverage. The wealthy do both: REITs for income, direct for development.",
            quiz: [
              { q: "REIT yield 7% vs direct yield 12%. Why REIT?", opts: ["Higher return", "Liquidity and diversification", "Tax benefit"], correct: 1 },
              { q: "Direct property advantage over REIT?", opts: ["Easier to sell", "Control, leverage, development upside", "No maintenance"], correct: 1 },
              { q: "Wealthy investor portfolio split?", opts: ["All REITs", "REITs for income + direct for development", "All direct"], correct: 1 },
              { q: "REIT yields 7%. Prime bank rate is 8.5%. Is the REIT still attractive?", opts: ["No — bank savings beat it", "Yes — REIT offers capital growth, liquidity, and diversification too", "Only if it is tax-exempt"], correct: 1 },
              { q: "R2M property, R400K deposit, R1.6M loan at 11.5%, monthly repayment ~R17K, rental R12K. Cash flow?", opts: ["Positive R5K — good yield", "Negative R5K — supplement from other income or find a better-yielding deal", "Break-even exactly"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Development Finance",
            notes: "Development profit is 20-30% on cost. But you need: land (30%), construction loan (60%), pre-sales (10%). Pre-sales de-risk the bank. A 50% pre-sale rate gets you the loan. Without pre-sales, you're self-funding or stuck.",
            quiz: [
              { q: "Development needs 50% pre-sales for construction loan. 20 units, pre-sell?", opts: ["5", "10", "15"], correct: 1 },
              { q: "Development margin 25% on R20M project. Profit?", opts: ["R2.5M", "R5M", "R10M"], correct: 1 },
              { q: "Pre-sales de-risk because?", opts: ["Guarantee quality", "Prove demand to bank, reduce interest risk", "Legal requirement"], correct: 1 },
              { q: "Pre-sales at 30% but bank requires 50%. Options?", opts: ["Abandon the development", "Sell more aggressively or seek mezzanine funder to bridge the shortfall", "Misrepresent sales to the bank"], correct: 1 },
              { q: "Development is 80% complete. Market prices drop 20%. Impact?", opts: ["None — you're nearly done", "Depends on pre-sale percentage — unsold units may now be underwater", "Developer absorbs all losses — fixed by law"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Tenant Quality & Retention",
            notes: "One bad tenant costs 6 months of rent in legal fees + repairs + lost income. Tenant screening: credit check, employer letter, previous landlord reference. Retention: respond to maintenance in 24 hours. A retained tenant saves R15,000 in turnover costs.",
            quiz: [
              { q: "Turnover cost: 1 month vacancy + R10K repairs + R5K advertising. Total?", opts: ["R15,000", "Depends on rent", "R10,000"], correct: 1 },
              { q: "Best tenant retention tool?", opts: ["Rent discount", "Fast maintenance response + respectful communication", "Strict rules"], correct: 1 },
              { q: "Tenant credit check primarily shows?", opts: ["Income", "Payment history and existing debt burden", "Criminal record"], correct: 1 },
              { q: "Tenant is 3 months in arrears. Proper legal process?", opts: ["Wait indefinitely for payment promises", "Section 129 notice → eviction order → sheriff — process takes 3-6 months", "Change the locks immediately"], correct: 1 },
              { q: "Tenant causes R80K damage. Deposit was only R15K. How to recover the difference?", opts: ["Write off the R65K shortfall as a loss", "Pursue through magistrate's court — viable for amounts above small claims limit", "Accept it — no legal remedy exists"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "The Generational Property Trust",
            notes: "Properties in a trust bypass estate duty and probate. Transfer to heirs without tax events. But trusts cost R15,000-R30,000 to set up and need annual admin. The alternative: heirs inherit, pay 20% estate duty, fight for 2 years. Trusts are generational insurance.",
            quiz: [
              { q: "R10M property inherited directly. Estate duty at 20%?", opts: ["R500,000", "R2M", "R1M"], correct: 1 },
              { q: "Trust setup cost R25,000. Estate duty saved R2M. Worth it?", opts: ["Break-even", "Massive — 80x return on setup cost", "Depends on age"], correct: 1 },
              { q: "Trust requires?", opts: ["One signature", "Annual admin, trustees, compliance — ongoing cost", "Nothing after setup"], correct: 1 },
              { q: "You own 5 properties in your personal name. Comprehensive estate planning requires?", opts: ["A will is sufficient", "Will + trust structure + life cover for liquidity to pay estate costs", "Nothing while you are still alive"], correct: 1 },
              { q: "Family trust income taxed at flat 45% unless distributed. Tax-efficiency strategy?", opts: ["Keep income in trust to defer tax", "Distribute to beneficiaries in lower tax brackets — saves significantly", "Trusts pay no income tax at all"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "tech",
        name: "Tech Titan",
        desc: "Startups, venture capital & IPO architecture",
        startCash: 1000000,
        icon: "💻",
        assets: ["TECH", "VC", "IPO"],
        tagline: "Code that compounds",
        color: "#9B59B6",
        modules: [
          {
            id: 1,
            name: "The Valuation Game",
            notes: "Pre-revenue: valued on team + market + idea. Seed: R5M-R20M. Series A: 5-15x revenue multiple. The trap: raising at too high a valuation locks you into impossible growth. Better to raise R10M at R40M (25% dilution) than R10M at R100M (10% dilution) and fail the next round.",
            quiz: [
              { q: "Raise R10M at R40M valuation. Founder owns 60%. Post-money ownership?", opts: ["60%", "50%", "45%"], correct: 1 },
              { q: "Too-high valuation danger?", opts: ["Less dilution is good", "Next round down = founder wipeout + employee panic", "Founder looks smarter"], correct: 1 },
              { q: "Pre-revenue valuation based on?", opts: ["Current sales", "Team + market size + traction signals", "Founder's education"], correct: 1 },
              { q: "VC offers R5M for 25% equity. What is the post-money valuation?", opts: ["R5M", "R20M (R5M ÷ 25%)", "R15M (pre-money only)"], correct: 1 },
              { q: "Down round: raise R10M at R30M vs previous R50M valuation. Founder's priority?", opts: ["More dilution at lower valuation — painful but survival is the win", "Same dilution as previous round — protected", "Great deal — getting more cash for less dilution"], correct: 0 }
            ]
          },
          {
            id: 2,
            name: "Burn Rate & Runway",
            notes: "Monthly burn is your countdown timer. R500K/month with R5M in bank = 10 months runway. At 6 months, start fundraising. At 3 months, you're desperate. Desperate founders take terrible terms. Extend runway: cut non-core, defer hires, negotiate vendor payments.",
            quiz: [
              { q: "Burn R400K/month, bank R3.2M. Months runway?", opts: ["6", "8", "10"], correct: 1 },
              { q: "Fundraising should start when?", opts: ["1 month before broke", "6 months runway left", "After money runs out"], correct: 1 },
              { q: "Extend runway fastest by?", opts: ["Hiring more sales", "Cutting non-core costs, deferring hires", "Raising prices"], correct: 1 },
              { q: "You cut from 30 to 20 people. Burn drops from R800K to R550K. R4M in bank. New runway?", opts: ["5 months", "7.3 months (R4M ÷ R550K)", "10 months"], correct: 1 },
              { q: "Founder salary is R150K/month during a runway crisis. Board's advice?", opts: ["Protect it — founder morale is essential", "Cut to market minimum — shows investors commitment to survival", "Eliminate it entirely — free up cash"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Equity & Employee Options",
            notes: "ESOPs (Employee Stock Option Pools) attract talent when cash is tight. 10-15% pool is standard. Vesting: 4 years with 1-year cliff. If they leave before 1 year, zero. This aligns long-term interest. A developer with 1% of a R500M company = R5M motivation.",
            quiz: [
              { q: "ESOP pool of 10% on R200M valuation. Total option value?", opts: ["R10M", "R20M", "R2M"], correct: 1 },
              { q: "4-year vesting with 1-year cliff means?", opts: ["Get all after 1 year", "Get nothing before 1 year, then monthly over 3 years", "Get 25% each year"], correct: 1 },
              { q: "Why options over higher salary for startup employees?", opts: ["Cheaper for company", "Aligns employee with company success + preserves cash", "Tax benefit"], correct: 1 },
              { q: "Employee with 1% option grant leaves after 11 months. Cliff is 12 months. They receive?", opts: ["Full 1% — almost served", "Zero — cliff not reached, no vesting triggered", "Pro-rated 11/12 of the grant"], correct: 1 },
              { q: "Investor requests anti-dilution protection. On a down round this means?", opts: ["They lose the same percentage as founders", "Their ownership percentage is protected via a price adjustment mechanism", "They get their full investment returned first"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "B2B SaaS Metrics",
            notes: "Monthly Recurring Revenue (MRR) is the holy metric. Net Revenue Retention >100% means customers grow without you acquiring new ones. CAC payback <12 months is healthy. Churn >5%/month is a cancer. These numbers determine your valuation.",
            quiz: [
              { q: "MRR R100K, churn 5%/month. Lost revenue next month?", opts: ["R5,000", "R5,000 lost + expansion revenue", "R0"], correct: 0 },
              { q: "Net Revenue Retention 110% means?", opts: ["10% customer loss", "Existing customers spend 10% more than last year", "10% new customers"], correct: 1 },
              { q: "CAC payback 18 months vs 8 months. Which is better?", opts: ["18 months — more invested", "8 months — faster cash recovery", "Same"], correct: 1 },
              { q: "MRR R500K, churn 3%/month, expansion 5%/month. Net Revenue Retention?", opts: ["102% (5% in minus 3% out = net +2%)", "95% — churn dominates", "108%"], correct: 0 },
              { q: "Enterprise client wants to pay annually upfront. Cash flow impact?", opts: ["Deferred revenue complication only — no real benefit", "Cash flow acceleration — receive 12 months up front, recognize monthly", "No meaningful benefit at all"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "The IPO Blueprint",
            notes: "IPO is a branding event as much as a funding event. JSE Main Board: R5B+ market cap. AltX: R500M+. You'll need: 3 years audited financials, independent board, sponsor. The process takes 12-18 months and costs R10M-R20M. But liquidity for founders and employees is priceless.",
            quiz: [
              { q: "IPO cost R15M on R2B raise. Percentage?", opts: ["0.75%", "0.75% — cheap for liquidity", "15%"], correct: 1 },
              { q: "IPO process time?", opts: ["3 months", "12-18 months", "6 months"], correct: 1 },
              { q: "IPO main benefit for founders?", opts: ["More control", "Liquidity — can sell shares without selling company", "Lower tax"], correct: 1 },
              { q: "JSE listing needs 3 years of audited financials. You have 2 years. Timeline to list?", opts: ["List now — auditors can backfill", "Wait 12 months, complete year 3 audit, then proceed", "Use unaudited management accounts for year 1"], correct: 1 },
              { q: "Lock-up period prevents founders from selling shares for 6-12 months post-IPO. Its purpose?", opts: ["To punish founders for taking money out", "Signals ongoing commitment + prevents share price collapse on listing day", "A tax strategy to defer capital gains"], correct: 1 }
            ]
          }
        ]
      }
    ]
  },
  health: {
    name: "Professional Health",
    mindsets: [
      {
        id: "doctor",
        name: "Medical Doctor",
        desc: "Private practice & medical aid mastery",
        startCash: 20000,
        icon: "🩺",
        assets: ["BOND", "STOCK", "REAL"],
        tagline: "Prescribe prosperity",
        color: "#C0392B",
        modules: [
          {
            id: 1,
            name: "Practice Cash Flow Cycles",
            notes: "Medical aids pay in 30-90 days. Patients pay today. A practice that's 80% medical aid can starve while profitable. Balance: 60% medical aid (volume), 40% cash/private (speed). Build a cash buffer of 3 months operating expenses.",
            quiz: [
              { q: "Medical aid pays in 60 days. Monthly overhead is R80,000. Minimum buffer?", opts: ["R80,000", "R240,000 (3 months)", "R40,000"], correct: 1 },
              { q: "80% medical aid, 20% cash practice. Problem?", opts: ["None — medical aid is reliable", "Cash flow lag — too much waiting for payment", "Too much cash risk"], correct: 1 },
              { q: "Patient pays cash but wants to claim from medical aid themselves. You?", opts: ["Refuse — too complex", "Provide invoice, let them handle claim — cash today", "Do the claim for free"], correct: 1 },
              { q: "Practice debtors: R300K outstanding, 40% is 90+ days old. Action?", opts: ["Wait — they will pay eventually", "Write off 20%, chase 80% with statements + specialist debt collectors", "Stop seeing those patients"], correct: 1 },
              { q: "Cash advance against future medical aid claims at 2%/month interest. When is it justified?", opts: ["Always take it — liquidity is king", "Only when clinical income from freed cash exceeds the 2%/month cost", "Never — always predatory lending"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Medical Aid Tariff Mastery",
            notes: "Tariffs are negotiated, not given. Join networks strategically. Some networks bring volume but cut rates by 40%. Calculate: (Volume increase) × (Reduced rate) vs (Lower volume) × (Full rate). The math decides, not the sales pitch.",
            quiz: [
              { q: "Network offers 30% more patients at 25% lower tariff. Net revenue?", opts: ["Up 5%", "Down — 1.30 × 0.75 = 97.5% of original", "Up 30%"], correct: 1 },
              { q: "Tariff negotiation best approach?", opts: ["Accept first offer", "Benchmark against peers and negotiate up", "Reject all networks"], correct: 1 },
              { q: "Cash practice vs network practice?", opts: ["Always cash", "Hybrid — cash for speed, network for volume", "Always network"], correct: 1 },
              { q: "New scheme: 40% more patients at 40% lower rate. Net revenue vs current R500K?", opts: ["Higher — 40% more patients wins", "R420K — a drop (1.4 × 0.6 = 0.84 of current)", "Same — the math balances"], correct: 1 },
              { q: "On 5 medical aid panels, admin takes 15hrs/week. Solution?", opts: ["Leave all panels to save time", "Practice management software or dedicated billing agent — your time is R3K+/hr", "Do it on weekends"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Malpractice & Indemnity",
            notes: "Malpractice claims can reach R50M. Indemnity is not optional. But premiums vary 3x between providers. Shop annually. Risk management lowers premiums: informed consent, proper notes, peer review. A R200,000 premium is cheaper than one claim.",
            quiz: [
              { q: "Malpractice indemnity premium is R180,000/year. One claim could be?", opts: ["Same amount", "R5M-R50M — premium is cheap protection", "R10,000"], correct: 1 },
              { q: "Best way to lower indemnity premiums?", opts: ["Lie about procedures", "Strong risk management: notes, consent, protocols", "Switch jobs"], correct: 1 },
              { q: "Informed consent in writing primarily protects?", opts: ["The patient only", "Both patient and practitioner legally", "The hospital only"], correct: 1 },
              { q: "Patient posts a false negative review after a poor outcome. Your action?", opts: ["Respond publicly defending your clinical decisions", "Respond professionally and briefly, address privately — never breach patient confidentiality", "Ignore all online reviews"], correct: 1 },
              { q: "You expand into new procedures and a colleague advises increasing indemnity cover. Why?", opts: ["Higher premium is almost always a waste", "Each new procedure type adds specific risk — marginal premium is worth it vs potential claim", "Standard cover is always sufficient for licensed doctors"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Equipment & Property Levers",
            notes: "That R1.2M MRI. Lease it, don't buy it — technology obsoletes in 5 years. Property? Buy the building if practice is established 5+ years. Rent is an expense. Mortgage builds equity. Your rooms are your retirement fund.",
            quiz: [
              { q: "R1.2M medical equipment with 5-year tech life. Buy or lease?", opts: ["Buy — asset", "Lease — avoid obsolescence risk", "Either is same"], correct: 1 },
              { q: "Renting practice rooms for 10 years vs buying building?", opts: ["Renting — flexibility", "Buying — payments build equity, rent is lost", "Same cost"], correct: 1 },
              { q: "Property as retirement strategy for doctors?", opts: ["Poor — too risky", "Excellent — practice building appreciates + rental income", "Only for specialists"], correct: 1 },
              { q: "Hospital raises your room rental 50% on renewal. Decision process?", opts: ["Accept — the referral network is worth any cost", "Model exit costs vs 50% rental increase over 5 years — data decides", "Exit immediately regardless of consequences"], correct: 1 },
              { q: "Purchase practice building via a company vs your personal name. Main advantage?", opts: ["Company name looks more professional", "Pty Ltd insulates personal assets and may offer tax efficiency", "No meaningful difference between the two"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Doctor to Healthcare CEO",
            notes: "One practice = a job. Three practices = a business. A hospital group = an empire. But delegation is the challenge. Hire a practice manager when you have 2+ rooms. Your clinical time is worth R3,000+/hour. Admin is worth R200/hour. Delegate.",
            quiz: [
              { q: "Doctor earns R3,500/hr clinically. Admin takes 10 hrs/week. Cost?", opts: ["Nothing — do it yourself", "R35,000/week in lost clinical income", "R2,000/week"], correct: 1 },
              { q: "When to hire a practice manager?", opts: ["Day 1", "2+ rooms or when admin exceeds 8 hrs/week", "Never — do it yourself"], correct: 1 },
              { q: "Healthcare empire building requires?", opts: ["More degrees", "Systems, delegation, and business skills", "Just more patients"], correct: 1 },
              { q: "Practice 2 opens and makes R30K loss/month while building its patient base. How long to sustain?", opts: ["Close it immediately — losses are never acceptable", "Budget 6-12 months ramp-up — losses are investment in expansion", "Take a personal loan daily until profitable"], correct: 1 },
              { q: "You want to sell your practice eventually. Key value drivers buyers look for?", opts: ["Patient list size only", "Systems, billing efficiency, contracts, staff retention, and reputation", "Location and equipment only"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "dentist",
        name: "Dentist",
        desc: "Clinic equipment & patient flow engineering",
        startCash: 25000,
        icon: "🦷",
        assets: ["EQUIP", "BOND", "SAVE"],
        tagline: "Smiles pay dividends",
        color: "#1ABC9C",
        modules: [
          {
            id: 1,
            name: "Chair Time Monetization",
            notes: "A dental chair generates revenue only when occupied. R2,500/hour potential. 6 hours/day = R15,000. But hygiene, sterilization, and admin take 2 hours. Net productive time: 4 hours = R10,000. Optimize: digital impressions save 15 min per patient = 1 extra patient/day.",
            quiz: [
              { q: "Chair potential R2,500/hr × 6 hrs = R15,000. Actual 4 productive hrs. Lost?", opts: ["R2,500", "R5,000", "R7,500"], correct: 1 },
              { q: "Digital impressions save 15 min/patient. 8 patients/day. Extra time?", opts: ["1 hour", "2 hours", "30 min"], correct: 1 },
              { q: "Hygienist sees patient for cleaning. Doctor sees for exam. Efficiency?", opts: ["Lower — two people involved", "Higher — parallel processing, doctor only for diagnosis", "Same"], correct: 1 },
              { q: "You have 2 chairs but work alone. Chair 2 sits idle 8 hrs/day at R2,500/hr potential. Annual loss?", opts: ["R2.5M", "R5M (R2,500 × 8 hrs × 250 days)", "R750K"], correct: 1 },
              { q: "Digital impressions save 15 min per patient. You see 6 patients/day. Extra time freed in 20 days?", opts: ["15 hours total", "30 hours total (6 × 15min × 20 days)", "45 hours total"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Equipment ROI Calculations",
            notes: "That R800K CAD/CAM machine. It enables same-day crowns at R8,000 vs lab crowns at R4,500. But you charge R12,000 for convenience. Margin: R12,000 - R800 (materials) = R11,200. 5 same-day crowns/month pays the machine in 15 months.",
            quiz: [
              { q: "CAD/CAM R800K. Profit R11,200/crown. 5/month. Payback?", opts: ["12 months", "14.3 months", "20 months"], correct: 1 },
              { q: "Same-day crown convenience premium?", opts: ["R0 — same price", "R3,500-R4,000 premium", "R1,000"], correct: 1 },
              { q: "Equipment finance vs cash for R800K machine?", opts: ["Always cash", "Finance preserves cash for working capital", "Always lease"], correct: 1 },
              { q: "CAD/CAM enables 5 same-day crowns/month, each adding R11,200 profit. Monthly machine payback contribution?", opts: ["R56,000/month contribution to payback", "R11,200 total across all crowns", "R22,400 contribution"], correct: 0 },
              { q: "Cone beam CT scanner (R400K) attracts specialist referrals worth R80K/month. Payback period?", opts: ["5 months (R400K ÷ R80K)", "8 months", "10 months"], correct: 0 }
            ]
          },
          {
            id: 3,
            name: "Patient Recall Systems",
            notes: "A recalled patient costs R50 in SMS/phone. A new patient costs R800 in marketing. 1,000 active patients, 80% recall rate = 800 visits. At 60% = 600 visits. That 20% drop costs R160,000 in new patient acquisition. Recall is profit.",
            quiz: [
              { q: "1,000 patients. 80% recall = 800 visits. 60% recall = 600. Lost revenue at R1,500/visit?", opts: ["R100,000", "R300,000", "R200,000"], correct: 1 },
              { q: "Recall cost R50 vs new patient cost R800. Ratio?", opts: ["10x cheaper", "16x cheaper", "Same"], correct: 1 },
              { q: "Best recall method?", opts: ["Wait for patient to call", "Automated SMS 2 weeks before due date + phone follow-up", "Annual letter"], correct: 1 },
              { q: "Stop recall reminders to save R5K/month. You lose 200 patients. Annual revenue lost at 2 visits × R1,500?", opts: ["R300,000", "R600,000 (200 × 2 × R1,500)", "R150,000"], correct: 1 },
              { q: "New app lets patients book and confirm recall appointments online. Key benefit?", opts: ["Patients rarely use dental apps", "Reduces no-shows, automatically fills gaps, frees reception time", "Creates a cybersecurity risk"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Dental Lab Negotiations",
            notes: "Lab work is 20-30% of crown revenue. A R3,500 lab bill on a R12,000 crown. Negotiate volume discounts: 20+ units/month gets 15% off. Multiple lab relationships prevent hostage situations. Quality labs are partners, not vendors.",
            quiz: [
              { q: "Lab bill R3,500, 15% volume discount. New bill?", opts: ["R3,000", "R2,975", "R3,200"], correct: 1 },
              { q: "Multiple lab relationships?", opts: ["Wasteful — loyalty matters", "Smart — competition ensures price and quality", "Illegal"], correct: 1 },
              { q: "Lab turnaround is 5 days. Patient wants 2 days. You?", opts: ["Rush for free — patient satisfaction", "Premium rush fee or same-day with in-house CAD/CAM", "Refuse"], correct: 1 },
              { q: "Lab rush job (3 days) costs 40% more on R3,500 fee. Patient willing to pay a premium. Minimum charge?", opts: ["R4,900 only — just lab cost", "R4,900 lab cost plus your own margin added on top", "R3,500 — absorb the rush cost"], correct: 1 },
              { q: "New lab offers 30% lower prices but sample crowns show minor shade discrepancies. Decision?", opts: ["Switch — the savings are significant", "Keep quality lab — shade errors lead to costly remakes and patient dissatisfaction", "Split work 50/50 between both labs"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "From Clinic to DSO",
            notes: "Dental Support Organizations (DSOs) manage admin for multiple dentists. You focus on teeth, they handle HR, billing, marketing. DSOs take 15-25% of revenue. But your stress drops 70% and you can open 3 locations. Scale through systems.",
            quiz: [
              { q: "DSO takes 20% but handles all admin. Your clinic revenue R150K/month. Net to you?", opts: ["R120,000", "R130,000", "R100,000"], correct: 0 },
              { q: "DSO advantage for dentist?", opts: ["Higher income", "Focus on dentistry, scale to multiple locations", "No patients"], correct: 1 },
              { q: "Opening 3 locations without DSO requires?", opts: ["Work 3x harder", "Systems and managers — otherwise you own 3 jobs", "More dentists only"], correct: 1 },
              { q: "DSO takes 18% of revenue. You spend 25hrs/week on admin at R3,500/hr clinical value. Worth it?", opts: ["Too expensive at 18%", "R87,500/week of clinical time recovered — calculate 18% vs that figure", "Ask a colleague for their opinion"], correct: 1 },
              { q: "DSO standardizes your product range and you lose some preferred brands. Risk level?", opts: ["Major — your clinical identity is compromised", "Minor — patient outcomes are similar and DSO reduces procurement friction", "Always reject any DSO for this reason"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: "physio",
        name: "Physiotherapist",
        desc: "Wellness centre & rehab business mastery",
        startCash: 15000,
        icon: "💪",
        assets: ["SKILL", "BOND", "REAL"],
        tagline: "Movement is money",
        color: "#E67E22",
        modules: [
          {
            id: 1,
            name: "Session Packaging & Prepayment",
            notes: "Single session: R650. 10-session package: R5,500 (15% discount). Prepayment gives you cash today for treatment over 10 weeks. Cash flow win + patient commitment win. But account for breakage: 20% of package buyers don't finish. That's pure margin.",
            quiz: [
              { q: "10-session package R5,500 vs 10 × R650 = R6,500. Discount?", opts: ["10%", "15.4%", "20%"], correct: 1 },
              { q: "20% package breakage means?", opts: ["Lost revenue", "Patients pay but don't use — pure profit on unused sessions", "Refunds needed"], correct: 1 },
              { q: "Prepayment advantage for clinic?", opts: ["None — just accounting", "Cash today for future work — cash flow acceleration", "Patient pays more"], correct: 1 },
              { q: "You sell 50 packages in January. 20% don't complete. Revenue recognized vs delivered?", opts: ["Recognize all R275K upfront — paid in full", "Recognize completed portion, defer unused sessions as a liability", "Wait until every session is delivered before recognizing anything"], correct: 1 },
              { q: "Patient wants refund on 2 unused sessions from a 10-session package. Fair policy?", opts: ["No refunds — they committed upfront", "Pro-rated refund on unused 2 sessions minus a small admin fee — fair and trust-building", "Full refund always — customer is king"], correct: 1 }
            ]
          },
          {
            id: 2,
            name: "Insurance vs Cash Mix",
            notes: "Insurance pays R550/session after 30-60 days. Cash pays R650 today. A 50/50 mix balances volume and cash flow. But insurance pre-authorizations waste 15 min/session. Build systems: online pre-auth, batch submissions, dedicated billing staff.",
            quiz: [
              { q: "Insurance R550 delayed 45 days. Cash R650 today. Same 10 sessions. Which?", opts: ["Insurance — guaranteed", "Cash — higher and immediate", "50/50 mix balances both"], correct: 2 },
              { q: "Pre-auth takes 15 min/session. 8 sessions/day. Lost time?", opts: ["1 hour", "2 hours", "30 min"], correct: 1 },
              { q: "Dedicated billing staff at R12,000/month. They recover R40,000/month in faster claims. Worth it?", opts: ["Break-even", "R28,000 net gain — absolutely", "Maybe"], correct: 1 },
              { q: "Discovery requires annual re-registration. Missing deadline blocks claims for 30 days. Impact on R200K/month practice?", opts: ["R0 — just defer it to next month", "R110K cash flow gap if 55% of revenue is medical aid dependent", "Your insurance covers this gap"], correct: 1 },
              { q: "New insurance panel: 25% more patients at 20% lower rates. Net revenue calculation?", opts: ["Positive — more patients always wins", "Break-even: 1.25 × 0.80 = 1.00 — only join if overhead is scalable", "Always negative — lower rates always hurt"], correct: 1 }
            ]
          },
          {
            id: 3,
            name: "Workshop & Corporate Contracts",
            notes: "One corporate ergonomic assessment: R15,000. A wellness day: R25,000. These are pure margin — no equipment, just expertise. 2 corporate days/month = R50,000 extra. Build relationships with HR managers. Your knowledge is scalable.",
            quiz: [
              { q: "2 corporate wellness days at R25,000 each. Monthly extra revenue?", opts: ["R25,000", "R50,000", "R75,000"], correct: 1 },
              { q: "Corporate ergonomics workshop margin vs clinical session?", opts: ["Lower", "Higher — group setting, no equipment per person", "Same"], correct: 1 },
              { q: "Best corporate client approach?", opts: ["Cold email", "LinkedIn connection + offer free 15-min consultation", "Wait for referral"], correct: 1 },
              { q: "Corporate cancels a 3-month wellness contract at the halfway mark. Clause you need?", opts: ["Verbal agreement is always sufficient", "30-day written notice clause + 50% cancellation fee provisions", "Clients in corporate always honor agreements"], correct: 1 },
              { q: "4 corporate workshops/month at R20K each vs clinical (6 sessions × 20 days × R650). Which wins?", opts: ["Clinical — more patients, more income", "Corporate: R80K vs clinical R78K — plus significantly less physical strain", "Exactly equal — no material difference"], correct: 1 }
            ]
          },
          {
            id: 4,
            name: "Gym & Studio Partnerships",
            notes: "Partner with gyms: R3,000/month for a treatment room. Their members get 10% off. You get foot traffic. A gym with 500 members, 5% need physio monthly = 25 new assessments. At 30% conversion to treatment = 8 new patients/month.",
            quiz: [
              { q: "Gym room cost R3,000/month. 8 new patients at R600/session. First month?", opts: ["Loss", "R1,800 profit if they do 1 session each", "R4,800 profit"], correct: 1 },
              { q: "500 gym members, 5% need physio. Assessments?", opts: ["10", "25", "50"], correct: 1 },
              { q: "Partnership vs own location?", opts: ["Own location always better", "Partnership: lower rent, built-in leads, shared risk", "Partnership is unprofessional"], correct: 1 },
              { q: "Gym changes ownership. New owner doubles your room rental with 6 months left on lease. Options?", opts: ["Accept new terms — convenience matters", "Enforce your existing lease terms + plan exit strategy before renewal", "Leave immediately even if it breaches the lease"], correct: 1 },
              { q: "Gym wants exclusive deal — you cannot work with any other gym in 5km. How to respond?", opts: ["Accept — single focus is better for quality", "Negotiate: exclusivity requires a patient volume guarantee or rent reduction", "Always reject any exclusivity clause outright"], correct: 1 }
            ]
          },
          {
            id: 5,
            name: "Digital Rehab & Telehealth",
            notes: "Telehealth sessions: R450 vs R650 in-person. But no rent, no travel time, no cleaning between patients. You can do 12/day vs 8 in-person. Revenue: 12 × R450 = R5,400 vs 8 × R650 = R5,200. Plus you can serve patients nationwide.",
            quiz: [
              { q: "Telehealth 12 sessions × R450. In-person 8 × R650. Daily?", opts: ["In-person wins", "Telehealth: R5,400 vs R5,200", "Same"], correct: 1 },
              { q: "Telehealth geographic advantage?", opts: ["None — same patients", "Nationwide reach — new market", "Lower quality"], correct: 1 },
              { q: "Digital rehab app as subscription?", opts: ["Replaces in-person", "Supplement: R199/month passive income + patient retention", "Not viable"], correct: 1 },
              { q: "Telehealth platform charges 15% of your R450 session fee. Net income per session?", opts: ["R450 — platform fee is their problem", "R382.50 after the 15% platform commission", "R400 — flat deduction"], correct: 1 },
              { q: "Home exercise app at R199/month, 200 active users. Annual passive income?", opts: ["R39,800 per month", "R477,600 per year (200 × R199 × 12)", "R199,000 total"], correct: 1 }
            ]
          }
        ]
      }
    ]
  }
};

export const assetNames: Record<string, string> = {
  BRD: "Bread Supplier",
  COKE: "Soft Drinks Corp",
  TRANS: "Transnet Freight",
  MACHINE: "Industrial Machinery",
  TECH: "Naspers Tech",
  BOND: "SA Govt Bonds",
  STOCK: "JSE Top 40 ETF",
  REAL: "Growthpoint Property",
  ENDOW: "Old Mutual Endowment",
  FOOD: "Tiger Brands",
  EQUIP: "Eqstra Holdings",
  SAVE: "Capitec Savings",
  PRODUCT: "Avon Products",
  RENTAL: "Redefine Properties",
  EXPORT: "Pepkor Exports",
  IPO: "Tech IPO Fund",
  RAW: "Anglo American",
  CONGLOM: "Remgro Conglomerate",
  PROPERTY: "Attacq Property",
  REIT: "Hygiena REIT",
  DEVELOP: "Calgro Developers",
  VC: "4Di Tech VC",
  FUEL: "Sasol Energy",
  TYRES: "Apollo Tyres",
  SKILL: "Skill Trade Index",
};

export const marketAssets = [
  { symbol: "JSE", name: "JSE All Share", basePrice: 78000, volatility: 0.008 },
  { symbol: "GLD", name: "Gold Rand", basePrice: 1850, volatility: 0.012 },
  { symbol: "PLT", name: "Platinum", basePrice: 980, volatility: 0.018 },
  { symbol: "ZAR", name: "USD/ZAR", basePrice: 18.5, volatility: 0.005 },
  { symbol: "BTC", name: "Bitcoin ZAR", basePrice: 1250000, volatility: 0.025 },
  { symbol: "NPN", name: "Naspers", basePrice: 2850, volatility: 0.015 },
  { symbol: "FSR", name: "FirstRand", basePrice: 72, volatility: 0.009 },
  { symbol: "MTN", name: "MTN Group", basePrice: 145, volatility: 0.011 },
];

// ─── Shared modules — shown for every mindset ─────────────────────────────────
// IDs 101–110 are reserved for these cross-cutting educational modules.

export const sharedModules: Module[] = [
  {
    id: 101,
    name: "How to Read JSE Graphs",
    notes: "A candlestick chart tells a story. The green candle (close > open) shows buyers won that period. Red means sellers won. The 'wick' shows how far price went but couldn't hold. On the JSE, volume spikes on Thursdays often signal institutional rebalancing — watch for that. Support level = floor price buyers defend. Resistance = ceiling sellers attack. When price breaks resistance on high volume, that's a real breakout. When it's low volume, be cautious — it's often a trap.",
    quiz: [
      { q: "A green (bullish) candlestick means?", opts: ["Price fell during the period", "Price closed higher than it opened", "Price didn't move"], correct: 1 },
      { q: "High volume on a breakout above resistance means?", opts: ["The move is likely a trap", "Strong buyer conviction — more reliable signal", "Time to sell immediately"], correct: 1 },
      { q: "JSE All Share at 'support' level. You should?", opts: ["Panic sell — it's falling", "Watch volume — strong support + low volume = potential bounce", "Ignore it completely"], correct: 1 },
      { q: "A long upper wick on a candle means?", opts: ["Buyers pushed price up but sellers pushed it back down", "Price rose strongly and held", "Volume was high"], correct: 0 },
      { q: "Moving average (MA) crossing above the price line usually signals?", opts: ["Strong buy signal", "Bearish — price may continue down", "No meaning — just lines"], correct: 1 },
    ],
  },
  {
    id: 102,
    name: "JSE Trading Strategies",
    notes: "Three strategies rule the JSE. (1) Buy and Hold: buy quality blue chips (Naspers, Anglo, FirstRand) and hold 5+ years. Beats 80% of active traders. (2) Dividend Capture: buy before ex-dividend date, collect dividend, sell. Works best with high-yield stocks like Redefine Properties and British American Tobacco SA. (3) Momentum: buy stocks making new 52-week highs on high volume. Cut losses at 8% below entry. Never average down on a losing position — you're fighting the market. The golden rule: never risk more than 2% of your portfolio on any single trade.",
    quiz: [
      { q: "Buy-and-hold strategy works best for?", opts: ["Quick daily profits", "5–10+ year wealth building with blue-chip stocks", "Traders with lots of time to watch markets"], correct: 1 },
      { q: "Ex-dividend date in dividend capture means?", opts: ["Last day to buy and still receive the dividend", "Day dividends are paid", "First day stock trades without dividend rights"], correct: 0 },
      { q: "Momentum trading: stock is down 9% from your entry. You should?", opts: ["Average down — buy more at the lower price", "Cut the loss — your 8% stop was breached", "Hold and hope it recovers"], correct: 1 },
      { q: "2% portfolio risk rule means: R100,000 portfolio. Max loss per trade?", opts: ["R10,000", "R2,000", "R500"], correct: 1 },
      { q: "A stock makes a new 52-week high on triple average volume. This suggests?", opts: ["It's overbought — sell immediately", "Strong momentum — potential trend continuation", "Nothing meaningful"], correct: 1 },
    ],
  },
  {
    id: 103,
    name: "Smart Investing Principles",
    notes: "Warren Buffett's Rule #1: Never lose money. Rule #2: Never forget Rule #1. Diversification is not owning 10 tech stocks — it's owning different asset classes (equities, bonds, property, cash, commodities). A South African investor's blind spot: too much Rand exposure. Hedge by holding global ETFs (like the Satrix MSCI World) alongside local stocks. Time IN the market beats TIMING the market 93% of the time over 10+ years. Tax: capital gains tax (CGT) in SA has a R40,000 annual exclusion — use it. Keep an investment diary — track your thesis for every investment. If you can't explain it in 2 sentences, you don't understand it.",
    quiz: [
      { q: "True diversification means?", opts: ["10 different tech stocks", "Different asset classes: equities, bonds, property, cash, global", "Stocks from different brokers"], correct: 1 },
      { q: "Satrix MSCI World ETF helps a SA investor by?", opts: ["Tracking the JSE top 40", "Providing global exposure, hedging Rand risk", "Giving tax benefits"], correct: 1 },
      { q: "Annual CGT exclusion in South Africa is?", opts: ["R0 — all gains are taxed", "R40,000 — gains below this are tax-free", "R100,000"], correct: 1 },
      { q: "You've held a stock for 3 years. If you sell now with a R50,000 gain, you pay CGT on?", opts: ["R50,000 fully", "R10,000 (R50,000 - R40,000 exclusion)", "Nothing — held over 1 year"], correct: 1 },
      { q: "Best strategy for a new investor with R500/month to invest?", opts: ["Save until you have R50,000 then invest", "Monthly debit order into a diversified ETF — benefit from rand cost averaging", "Wait for a market crash"], correct: 1 },
    ],
  },
  {
    id: 104,
    name: "EasyEquities — Your Gateway to the JSE",
    notes: "EasyEquities is South Africa's most accessible investment platform. Minimum investment: R1. You can buy fractional shares — so you can own a slice of Naspers (R2,850/share) for just R10. They offer: JSE stocks, ETFs, US shares (in USD), and a TFSA (Tax-Free Savings Account) that gives you up to R36,000/year in tax-free growth. How to start: (1) Open account at easyequities.co.za — free, takes 5 minutes with just your ID. (2) FICA verify — upload selfie + ID. (3) Fund with EFT or debit card from R1. (4) Buy. TFSA tip: put your highest-growth assets in your TFSA. All dividends and gains inside a TFSA are 100% tax-free for life. The fee: 0.25% per trade (+ VAT). On a R100 trade, that's 25 cents.",
    quiz: [
      { q: "EasyEquities minimum investment is?", opts: ["R100", "R1,000", "R1"], correct: 2 },
      { q: "TFSA annual contribution limit in South Africa is?", opts: ["R36,000", "R100,000", "Unlimited"], correct: 0 },
      { q: "Fractional shares mean?", opts: ["Shares that are broken or faulty", "You can own a percentage of a full share from R1", "Shares sold at a discount"], correct: 1 },
      { q: "EasyEquities trade fee is approximately?", opts: ["5% per trade", "0.25% per trade (+ VAT)", "R50 flat per trade"], correct: 1 },
      { q: "Best assets to put inside your TFSA are?", opts: ["Cash savings — safest option", "High-growth equities and ETFs — tax-free compounding is most valuable", "Bonds — stable and low risk"], correct: 1 },
    ],
  },
];
