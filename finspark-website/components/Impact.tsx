import type { CSSProperties } from "react";

const stats = [
  { count: 530, suffix: "+", label: "Quiz Questions" },
  { count: 17, suffix: "", label: "Learning Pathways" },
  { count: 5, suffix: "", label: "Languages Supported" },
  { count: 100, suffix: "%", label: "Offline Capable" },
];

export default function Impact() {
  return (
    <section id="impact" className="section section-alt">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Impact &amp; Mission</p>
          <h2>Crime Prevention Through Financial Literacy</h2>
        </div>

        <div className="impact-content">
          <div className="impact-text reveal">
            <p>
              Financial desperation is one of the most consistent precursors to reoffending. FinSpark
              exists to interrupt that cycle. By equipping incarcerated and at-risk South Africans with
              practical money skills — and giving correctional facilitators the tools to track and
              verify progress — FinSpark turns rehabilitation into a measurable, repeatable process.
            </p>
            <p>
              Every certificate earned is more than a credential — it&apos;s evidence of changed
              thinking, presented to parole boards, employers, and communities as proof that a person
              is ready to build, not break.
            </p>
          </div>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={stat.label} className="stat-card reveal" style={{ "--i": i } as CSSProperties}>
                <div className="stat-num" data-count={stat.count} data-suffix={stat.suffix}>
                  0
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
