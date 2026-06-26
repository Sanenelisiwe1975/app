import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  fullName: string;
  email: string;
  organisation?: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  const { fullName, email, organisation, subject, message } =
    (await request.json()) as ContactPayload;

  if (!fullName || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "FinSpark Website <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? "info@finspark.co.za",
      replyTo: email,
      subject: `[FinSpark Contact] ${subject} — ${fullName}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Organisation: ${organisation || "—"}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again later." },
      { status: 500 }
    );
  }
}
