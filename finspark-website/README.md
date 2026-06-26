# FinSpark Website

The marketing site for FinSpark — a gamified financial literacy platform for South Africa,
covering correctional facilities, township businesses, students, corporate professionals,
business owners, and medical professionals.

Built with Next.js (App Router) and TypeScript, using a custom dark-luxury design system
(no Tailwind) ported from the original static site.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Contact Form

The contact form (`/#contact`) sends email via [Resend](https://resend.com). To enable it locally,
copy `.env.local.example` to `.env` (or `.env.local`) and set:

- `RESEND_API_KEY` — your Resend API key
- `CONTACT_TO_EMAIL` — the inbox that should receive submissions

Without these, the form shows a friendly error but the site still builds and runs.

## Structure

- `app/` — App Router pages, layout, global styles, and the `/api/contact` route handler
- `components/` — one component per section (Hero, WhoWeServe, About, Solution, Features,
  Impact, Testimonials, Contact, Footer, etc.) plus shared pieces (Header, IconSprite,
  BrandLogo, ScrollEffects, BackToTop)

## Deployment

Deployed to Vercel via the CLI (`npx vercel --prod`). Remember to set `RESEND_API_KEY` and
`CONTACT_TO_EMAIL` as Vercel environment variables rather than relying on the local `.env` file.
