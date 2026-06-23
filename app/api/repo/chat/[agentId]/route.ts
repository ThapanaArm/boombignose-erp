import { NextRequest, NextResponse } from "next/server";
import { listByAgent, send } from "@/lib/repo-chat";

export async function GET(_: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return NextResponse.json({ messages: listByAgent(agentId) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const body = await req.json();
  const sender = body.sender === "agent" ? "agent" : "officer";
  const text = (body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  const message = send(agentId, sender, text);
  return NextResponse.json({ message }, { status: 201 });
}
