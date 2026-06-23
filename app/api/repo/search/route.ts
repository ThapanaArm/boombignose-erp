import { NextRequest, NextResponse } from "next/server";
import { searchLoans, searchByPlate } from "@/lib/repo-store";

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const plate = sp.get("plate");

  // search by license plate (field-agent portal) → list of matching vehicles
  if (plate !== null) {
    return NextResponse.json({ results: plate.trim() ? searchByPlate(plate) : [] });
  }

  // free-text search (q) — public page
  const q = sp.get("q") ?? "";
  return NextResponse.json({ results: q.trim() ? searchLoans(q) : [] });
}
