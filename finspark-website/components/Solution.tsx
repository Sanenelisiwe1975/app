const APP_URL = "https://app.finspark.co.za";

const checkItems = [
  "17 personalised learning paths across 5 audience groups",
  "Live JSE-style market simulator with real trading mechanics",
  "Stokvel community savings simulator with payout voting",
  "SHA-256 verified certificates with expiring QR codes",
  "SAPS SynchroLearn institutional portal with parole reporting",
  "Available in English, isiZulu, isiXhosa, Sesotho & Afrikaans",
];

export default function Solution() {
  return (
    <section id="solution" className="section section-alt">
      <div className="container solution-grid">
        <div className="solution-text reveal">
          <p className="eyebrow">The Platform</p>
          <h2>
            Meet <span className="gold-text">FinSpark</span>
          </h2>
          <p>
            FinSpark is a fully gamified financial literacy simulator built for the South African
            market. Through interactive lessons, real-world JSE market simulations, community stokvel
            mechanics, and a built-in anti-scam academy, users learn to budget, save, invest, and
            protect themselves — all while levelling up, earning XP, and unlocking verified
            certificates.
          </p>

          <div className="solution-callout">
            <strong>SAPS SynchroLearn:</strong> built in partnership with correctional reintegration
            programmes, our institutional portal gives facilitators a dedicated dashboard to manage
            offender cases, track quiz performance, and generate parole-ready progress reports.
          </div>

          <ul className="check-list">
            {checkItems.map((item) => (
              <li key={item}>
                <svg className="icon">
                  <use href="#icon-check" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* TODO: replace with the live FinSpark app URL */}
          <a href={APP_URL} className="btn btn-gold">
            Launch App
          </a>
        </div>

        <div className="solution-visual reveal">
          <div className="phone-glow" aria-hidden="true"></div>
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="app-header">
                <span className="app-logo">FinSpark</span>
                <span className="app-badge">SynchroLearn</span>
              </div>
              <div className="app-networth">
                <span className="label">Net Worth</span>
                <span className="value">R 124,580</span>
                <span className="trend">▲ 12.4% this month</span>
              </div>
              <div className="app-xp">
                <div className="xp-label">
                  <span>Level 7</span>
                  <span>2,450 / 3,000 XP</span>
                </div>
                <div className="xp-bar">
                  <div className="xp-fill"></div>
                </div>
              </div>
              <div className="app-badges">
                <div className="badge-icon gold">★</div>
                <div className="badge-icon emerald">✓</div>
                <div className="badge-icon teal">R</div>
                <div className="badge-icon purple">▲</div>
              </div>
              <div className="app-modules">
                <div className="module-card">
                  <span className="dot teal"></span>Learn
                </div>
                <div className="module-card">
                  <span className="dot blue"></span>Market
                </div>
                <div className="module-card">
                  <span className="dot gold"></span>Portfolio
                </div>
                <div className="module-card">
                  <span className="dot purple"></span>Stokvel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
