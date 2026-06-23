import { NextRequest, NextResponse } from "next/server";
import { searchLoans } from "@/lib/repo-store";

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  return NextResponse.json({ results: searchLoans(q) });
}
