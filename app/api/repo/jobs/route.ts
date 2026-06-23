import { NextRequest, NextResponse } from "next/server";
import { jobs, createJob, createJobsBulk } from "@/lib/repo-jobs";

export function GET() {
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Bulk import (from PDF): { rows: [...] }
  if (Array.isArray(body.rows)) {
    const created = createJobsBulk(body.rows);
    return NextResponse.json({ jobs: created, count: created.length }, { status: 201 });
  }
  const job = createJob(body);
  return NextResponse.json({ job }, { status: 201 });
}
