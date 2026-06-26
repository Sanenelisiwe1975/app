import BrandLogo from "./BrandLogo";

const APP_URL = "https://app.finspark.co.za";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="brand">
            <BrandLogo className="brand-logo" />
            <span className="brand-name">
              Fin<strong>Spark</strong>
            </span>
          </a>
          <p>
            Building wealth mindsets across South Africa — one mindset, one module, one second chance
            at a time.
          </p>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#solution">Our Solution</a>
            </li>
            <li>
              <a href="#impact">Impact &amp; Mission</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li>
              <a href="#features">Key Features</a>
            </li>
            {/* TODO: replace with the live FinSpark app URL */}
            <li>
              <a href={APP_URL}>Launch App</a>
            </li>
            <li>
              <a href="#contact">Partnerships</a>
            </li>
            <li>
              <a href="#contact">Support</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:info@finspark.co.za">info@finspark.co.za</a>
            </li>
            <li>
              <a href="tel:+27210000000">+27 (0)21 000 0000</a>
            </li>
            <li>
              <a href="#contact">Cape Town, South Africa</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="beadwork-bar" aria-hidden="true"></div>

      <div className="container footer-bottom">
        <span>&copy; 2026 FinSpark. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
