import type { CSSProperties } from "react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">Testimonials</p>
          <h2>Voices From Our Community</h2>
          <p className="section-lead">
            Illustrative feedback from the kind of impact FinSpark is designed to create.
          </p>
        </div>

        {/* Sample / placeholder testimonials — replace with verified quotes once collected */}
        <div className="testimonial-grid">
          <div className="testimonial-card reveal" style={{ "--i": 0 } as CSSProperties}>
            <div className="testimonial-mark">&ldquo;</div>
            <p className="testimonial-text">
              FinSpark gave our participants a reason to engage — they&apos;re not just serving time,
              they&apos;re building a plan for what comes after.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">TM</div>
              <div>
                <div className="author-name">T. Mahlangu</div>
                <div className="author-role">Correctional Programme Facilitator</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card reveal" style={{ "--i": 1 } as CSSProperties}>
            <div className="testimonial-mark">&ldquo;</div>
            <p className="testimonial-text">
              I started the Spaza Shop Owner pathway not knowing what &quot;compound interest&quot;
              meant. Three months later I opened my first tax-free savings account.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">N</div>
              <div>
                <div className="author-name">Nomvula</div>
                <div className="author-role">Programme Participant</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card reveal" style={{ "--i": 2 } as CSSProperties}>
            <div className="testimonial-mark">&ldquo;</div>
            <p className="testimonial-text">
              The stokvel simulator felt exactly like the one my grandmother ran — except now I
              understand the maths behind it.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div>
                <div className="author-name">Sipho</div>
                <div className="author-role">University Student Pathway</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
