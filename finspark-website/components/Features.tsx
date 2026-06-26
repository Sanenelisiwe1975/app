import type { CSSProperties } from "react";

const features = [
  {
    icon: "icon-trophy",
    title: "Gamified Learning Paths",
    text: "Earn XP, unlock badges, and level up through 17 mindset-based journeys covering budgeting, saving, investing, and entrepreneurship.",
  },
  {
    icon: "icon-chart",
    title: "JSE Market Simulator",
    text: "Practice buying and selling JSE-style assets with live price charts, moving-average signals, and full trade history — zero financial risk.",
  },
  {
    icon: "icon-certificate",
    title: "Verified Certificates",
    text: "Every completed pathway generates a tamper-proof, SHA-256-secured certificate with a time-limited QR code for instant verification.",
  },
  {
    icon: "icon-briefcase",
    title: "SAPS SynchroLearn Portal",
    text: "A dedicated facilitator dashboard for offender case management, quiz scoring, and exportable parole progress reports.",
  },
  {
    icon: "icon-globe",
    title: "5-Language Support",
    text: "Fully localised in English, isiZulu, isiXhosa, Sesotho, and Afrikaans — financial education in the language that feels like home.",
  },
  {
    icon: "icon-users",
    title: "Stokvel Simulator",
    text: "Experience South Africa's iconic rotating savings model with community payout voting and group accountability.",
  },
  {
    icon: "icon-shield",
    title: "Anti-Scam Academy",
    text: "20 real-world phishing and scam scenarios across 6 categories train users to spot fraud before it costs them.",
  },
  {
    icon: "icon-cloud-download",
    title: "Offline-First PWA",
    text: "Installable on any device and fully functional without an internet connection — built for low-data environments.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Key Features</p>
          <h2>Everything You Need to Build Real Financial Skills</h2>
          <p className="section-lead">
            FinSpark combines gamification, real-world simulation, and verifiable credentials into one
            premium experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={feature.title} className="feature-card reveal" style={{ "--i": i } as CSSProperties}>
              <div className="feature-icon">
                <svg className="icon">
                  <use href={`#${feature.icon}`} />
                </svg>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
