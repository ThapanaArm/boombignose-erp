import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BoomBigNose ERP — Smart Business Management",
  description:
    "BoomBigNose ERP unifies sales, inventory, purchasing, finance, and HR into one powerful platform built for growing businesses in Southeast Asia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
