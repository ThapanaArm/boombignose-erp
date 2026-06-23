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
  title: "AutoFinance Thailand — ระบบตรวจสอบและจัดการสินเชื่อยานยนต์",
  description:
    "ตรวจสอบสถานะสินเชื่อรถยนต์ และระบบหลังบ้านสำหรับจัดการสัญญา งานยึดรถ และพนักงานสนาม",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" data-scroll-behavior="smooth" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
