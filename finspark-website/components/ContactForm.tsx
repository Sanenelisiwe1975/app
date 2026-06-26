"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      organisation: formData.get("organisation"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again later.");
      }

      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again later.");
      setStatus("error");
    }
  }

  return (
    <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
      <div className={`form-success${status === "success" ? " show" : ""}`}>
        <svg className="icon">
          <use href="#icon-check" />
        </svg>
        <span>Thank you for reaching out. Our team will be in touch within 2 business days.</span>
      </div>

      {status === "error" && (
        <div className="form-success show form-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" placeholder="Your name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="organisation">Organisation</label>
          <input type="text" id="organisation" name="organisation" placeholder="Optional" />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select id="subject" name="subject" required defaultValue="">
            <option value="" disabled>
              Select a topic
            </option>
            <option>General Enquiry</option>
            <option>Partnership Opportunity</option>
            <option>SAPS / Government Programme</option>
            <option>Media &amp; Press</option>
            <option>Technical Support</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Tell us how we can help..." required></textarea>
      </div>

      <button type="submit" className="btn btn-gold btn-block" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
