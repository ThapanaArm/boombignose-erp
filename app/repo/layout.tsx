import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoFinance Thailand — ตรวจสอบสถานะสินเชื่อรถยนต์",
  description: "ตรวจสอบสถานะการชำระสินเชื่อรถยนต์ ค้นหาด้วยเลขที่สัญญา, เลขบัตรประชาชน หรือทะเบียนรถ",
};

export default function RepoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
