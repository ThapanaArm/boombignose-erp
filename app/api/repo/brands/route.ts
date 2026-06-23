import { NextRequest, NextResponse } from "next/server";
import { brands, createBrand } from "@/lib/repo-brands";

export function GET() {
  return NextResponse.json({ brands });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const brand = createBrand({
    name: body.name ?? "",
    active: body.active ?? true,
  });
  return NextResponse.json({ brand }, { status: 201 });
}
