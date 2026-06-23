import { NextRequest, NextResponse } from "next/server";
import { updateInstitution, deleteInstitution } from "@/lib/repo-institutions";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const institution = updateInstitution(id, body);
  if (!institution) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ institution });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteInstitution(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
