import { NextRequest, NextResponse } from "next/server";
import { updateAgent, deleteAgent, sanitizeAgent } from "@/lib/repo-agents";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  // Don't overwrite the password with a blank value (edit form leaves it empty to keep current)
  if (!body.password) delete body.password;
  const agent = updateAgent(id, body);
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ agent: sanitizeAgent(agent) });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteAgent(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
