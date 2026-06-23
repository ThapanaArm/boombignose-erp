import { redirect } from "next/navigation";

export default function Home() {
  // BoomBigNose ERP ถูกถอดออกแล้ว — เหลือเฉพาะระบบ AutoFinance
  redirect("/repo");
}
