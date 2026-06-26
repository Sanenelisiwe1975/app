import type { CSSProperties } from "react";

const pillars = [
  {
    title: "Innovation",
    text: "We combine behavioural science, gamification, and culturally grounded storytelling to make financial education stick.",
  },
  {
    title: "Empowerment",
    text: "Every module is designed to convert knowledge into action — from opening a savings account to reading a JSE share price.",
  },
  {
    title: "Impact",
    text: "We measure success not in downloads, but in net worth growth, debt reduction, and second chances created.",
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Who We Are</p>
          <h2>About FinSpark</h2>
          <p className="section-lead">
            A proudly South African company building purpose-driven technology for financial
            inclusion, rehabilitation, and economic empowerment.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-text reveal">
            <p>
              FinSpark was founded on a simple belief: access to financial education is a right, not a
              privilege. We design and build digital products that meet people where they are — in
              townships, in correctional facilities, in classrooms, and on the factory floor — and
              equip them with the tools to take control of their financial futures.
            </p>
            <p>
              Our flagship platform brings gamified, culturally relevant financial education to
              communities across South Africa, with a special focus on supporting correctional
              reintegration programmes by reducing recidivism through skills-based rehabilitation.
            </p>
            <div className="proverb">
              &quot;Umntu ngumntu ngabantu&quot;
              <span>A person is a person through others — the isiXhosa proverb that guides everything we build.</span>
            </div>
          </div>

          <div className="pillars">
            {pillars.map((pillar, i) => (
              <div key={pillar.title} className="pillar-card reveal" style={{ "--i": i + 1 } as CSSProperties}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
