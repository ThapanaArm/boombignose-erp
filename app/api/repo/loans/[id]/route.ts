import { NextRequest, NextResponse } from "next/server";
import { getLoanById, updateLoan, deleteLoan } from "@/lib/repo-store";

export function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const loan = getLoanById(params.id);
  if (!loan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ loan });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const loan = updateLoan(params.id, body);
  if (!loan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ loan });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const ok = deleteLoan(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
