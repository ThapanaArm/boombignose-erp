import { NextRequest, NextResponse } from "next/server";
import { getRequestById, decideRequest, addPhoto } from "@/lib/repo-requests";

export function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const request = getRequestById(id);
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ request });
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  // add a photo (after approval)
  if (typeof body.photo === "string") {
    const request = addPhoto(id, body.photo);
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ request });
  }

  // officer decision
  if (body.status === "approved" || body.status === "rejected") {
    const request = decideRequest(id, body.status);
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ request });
  }

  return NextResponse.json({ error: "ไม่มีการเปลี่ยนแปลงที่รองรับ" }, { status: 400 });
}
