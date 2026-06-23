import { NextRequest, NextResponse } from "next/server";
import { agents, createAgent } from "@/lib/repo-agents";

export function GET() {
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agent = createAgent({
    name: body.name ?? "",
    phone: body.phone ?? "",
    zone: body.zone ?? "",
    status: body.status ?? "available",
  });
  return NextResponse.json({ agent }, { status: 201 });
}
