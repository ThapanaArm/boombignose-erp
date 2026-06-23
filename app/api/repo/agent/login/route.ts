import { NextRequest, NextResponse } from "next/server";
import { findAgentByLogin, sanitizeAgent } from "@/lib/repo-agents";

export async function POST(req: NextRequest) {
  const { login, password } = await req.json();
  if (!login || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }
  const agent = findAgentByLogin(String(login));
  if (!agent || agent.password !== password) {
    return NextResponse.json({ error: "username/เบอร์โทร หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  return NextResponse.json({ agent: sanitizeAgent(agent) });
}
