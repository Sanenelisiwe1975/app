const APP_URL = "https://app.finspark.co.za";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="container hero-inner">
        <p className="eyebrow">FinSpark</p>
        <h1>
          Rewriting Futures Through <span className="gold-text">Financial Literacy</span>
        </h1>
        <p className="hero-sub">
          <strong>FinSpark</strong> is a gamified financial literacy platform helping SAPS offenders
          and everyday South Africans master money, build wealth, and break the cycle of poverty and
          crime.
        </p>
        <div className="hero-ctas">
          {/* TODO: replace with the live FinSpark app URL */}
          <a href={APP_URL} className="btn btn-gold btn-lg">
            Launch App
          </a>
          <a href="#solution" className="btn btn-outline btn-lg">
            Learn More
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">17</div>
            <div className="label">Learning Mindsets</div>
          </div>
          <div className="hero-stat">
            <div className="num">530+</div>
            <div className="label">Quiz Questions</div>
          </div>
          <div className="hero-stat">
            <div className="num">5</div>
            <div className="label">SA Languages</div>
          </div>
        </div>
      </div>
      <div className="beadwork-bar" aria-hidden="true"></div>
    </section>
  );
}
