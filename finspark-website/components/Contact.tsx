import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <div className="container contact-grid">
        <div className="contact-info reveal">
          <p className="eyebrow">Get In Touch</p>
          <h2 style={{ marginBottom: "20px" }}>
            Let&apos;s Build a Financially Literate South Africa — Together
          </h2>
          <p className="section-lead" style={{ marginBottom: "36px" }}>
            Whether you&apos;re a government department, NGO, correctional facility, or potential
            partner, we&apos;d love to hear from you.
          </p>

          <div className="contact-info-item">
            <div className="icon-wrap">
              <svg className="icon">
                <use href="#icon-mail" />
              </svg>
            </div>
            <div>
              <h4>Email</h4>
              <a href="mailto:info@finspark.co.za">info@finspark.co.za</a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap">
              <svg className="icon">
                <use href="#icon-phone" />
              </svg>
            </div>
            <div>
              <h4>Phone</h4>
              <a href="tel:+27210000000">+27 (0)21 000 0000</a>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap">
              <svg className="icon">
                <use href="#icon-map-pin" />
              </svg>
            </div>
            <div>
              <h4>Location</h4>
              <p>Cape Town, South Africa</p>
            </div>
          </div>

          <div className="social-row">
            <a href="#" className="social-icon" aria-label="LinkedIn">
              in
            </a>
            <a href="#" className="social-icon" aria-label="X (Twitter)">
              X
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
              f
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              IG
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
