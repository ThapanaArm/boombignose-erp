import { NextRequest, NextResponse } from "next/server";
import { agents, createAgent, sanitizeAgent } from "@/lib/repo-agents";

export function GET() {
  return NextResponse.json({ agents: agents.map(sanitizeAgent) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agent = createAgent({
    name: body.name ?? "",
    username: body.username ?? "",
    password: body.password ?? "1234",
    email: body.email ?? "",
    phone: body.phone ?? "",
    address: body.address ?? "",
    zone: body.zone ?? "",
    newsletter: !!body.newsletter,
    status: body.status ?? "available",
  });
  return NextResponse.json({ agent: sanitizeAgent(agent) }, { status: 201 });
}
