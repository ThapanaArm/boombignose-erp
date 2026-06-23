import { NextRequest, NextResponse } from "next/server";
import { institutions, createInstitution } from "@/lib/repo-institutions";

export function GET() {
  return NextResponse.json({ institutions });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const institution = createInstitution({
    name: body.name ?? "",
    code: body.code ?? "",
    contactName: body.contactName ?? "",
    phone: body.phone ?? "",
    active: body.active ?? true,
  });
  return NextResponse.json({ institution }, { status: 201 });
}
