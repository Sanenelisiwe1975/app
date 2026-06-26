import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinSpark | Gamified Financial Literacy for South Africa",
  description:
    "FinSpark is a gamified financial literacy platform empowering SAPS offenders and everyday South Africans to build wealth, master money, and rewrite their futures.",
  openGraph: {
    title: "FinSpark | Gamified Financial Literacy for South Africa",
    description:
      "Gamified financial literacy for South Africa — crime prevention through financial empowerment.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
