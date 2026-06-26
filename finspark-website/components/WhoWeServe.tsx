import type { CSSProperties } from "react";

const audiences = [
  {
    icon: "icon-key",
    color: "red",
    title: "Correctional Facilities",
    text: "From SAPS correctional centres to reintegration programmes, FinSpark turns time inside into a head start — building real financial skills before release day.",
  },
  {
    icon: "icon-store",
    color: "orange",
    title: "Township Entrepreneurs",
    text: "Stokvel simulations, micro-business budgeting, and cash-flow tools built for the realities of township economies and informal trade.",
  },
  {
    icon: "icon-graduation-cap",
    color: "blue",
    title: "University Students",
    text: "From student loans to first payslips, FinSpark helps students build the money habits that outlast their degree.",
  },
  {
    icon: "icon-briefcase",
    color: "gold",
    title: "Corporate Professionals",
    text: "JSE market simulations, tax-smart saving, and investment fundamentals for professionals ready to grow beyond the payslip.",
  },
  {
    icon: "icon-trending-up",
    color: "purple",
    title: "Business Owners",
    text: "Cash flow, credit, and growth-planning tools designed for South African entrepreneurs and SMME owners scaling their ventures.",
  },
  {
    icon: "icon-heart-pulse",
    color: "teal",
    title: "Medical Professionals",
    text: "Built for the unique income patterns and demanding schedules of healthcare workers — because your finances deserve the same care you give others.",
  },
];

export default function WhoWeServe() {
  return (
    <section id="who-we-serve" className="section section-alt">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">We Are Everywhere</p>
          <h2>One Platform, Every South African Journey</h2>
          <p className="section-lead">
            From correctional facilities to corporate boardrooms, FinSpark meets people where they
            are — with mindsets, language, and content built for their world.
          </p>
        </div>

        <div className="audience-grid">
          {audiences.map((audience, i) => (
            <div key={audience.title} className="audience-card reveal" style={{ "--i": i } as CSSProperties}>
              <div className={`audience-icon ${audience.color}`}>
                <svg className="icon">
                  <use href={`#${audience.icon}`} />
                </svg>
              </div>
              <h3>{audience.title}</h3>
              <p>{audience.text}</p>
            </div>
          ))}
        </div>

        <div className="ecosystem-note reveal">
          Every pathway — wherever it starts — leads to the same place: real financial literacy and
          real-world practical experience.
        </div>
      </div>
    </section>
  );
}
