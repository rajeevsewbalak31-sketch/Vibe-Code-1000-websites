import type { Metadata } from "next";
import { DM_Sans, Instrument_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buy a Square — €1",
  description:
    "Pick any square on the grid and pay €1 via PayPal. 100 squares, one euro each.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSans.variable}`}>
      <body className={`${dmSans.className} min-h-dvh antialiased`}>{children}</body>
    </html>
  );
}
