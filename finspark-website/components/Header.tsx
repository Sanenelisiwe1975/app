import BrandLogo from "./BrandLogo";

const APP_URL = "https://app.finspark.co.za";

const navLinks = [
  { href: "#who-we-serve", label: "Reach" },
  { href: "#about", label: "About" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#impact", label: "Impact" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="container header-inner">
          <a href="#home" className="brand">
            <BrandLogo className="brand-logo" />
            <span className="brand-name">
              Fin<strong>Spark</strong>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            {/* TODO: replace with the live FinSpark app URL */}
            <a href={APP_URL} className="btn btn-gold btn-sm">
              Launch App
            </a>
            <button className="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <nav className="mobile-menu" id="mobileMenu" aria-label="Mobile">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="nav-link">
            {link.label}
          </a>
        ))}
        {/* TODO: replace with the live FinSpark app URL */}
        <a href={APP_URL} className="btn btn-gold btn-lg">
          Launch App
        </a>
      </nav>
    </>
  );
}
