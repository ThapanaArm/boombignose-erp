import { NextRequest, NextResponse } from "next/server";
import { createAgent, isContactTaken, sanitizeAgent } from "@/lib/repo-agents";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!name || !phone || !email || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ (ชื่อ, เบอร์โทร, อีเมล, รหัสผ่าน)" }, { status: 400 });
  }
  if (isContactTaken(email, phone)) {
    return NextResponse.json({ error: "เบอร์โทรหรืออีเมลนี้ถูกใช้สมัครแล้ว" }, { status: 409 });
  }

  const agent = createAgent({
    name,
    username: email.toLowerCase(), // login by email or phone
    password,
    email,
    phone,
    address: (body.address ?? "").trim(),
    zone: "",                      // officer assigns the responsibility zone later
    newsletter: !!body.newsletter,
    status: "available",
  });
  return NextResponse.json({ agent: sanitizeAgent(agent) }, { status: 201 });
}
