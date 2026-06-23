import { NextRequest, NextResponse } from "next/server";
import { listRequests, createRequest, findRequest, type RequestStatus } from "@/lib/repo-requests";

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const agentId = sp.get("agentId") ?? undefined;
  const loanId = sp.get("loanId") ?? undefined;
  const status = (sp.get("status") as RequestStatus | null) ?? undefined;

  // agent checking its own request for a specific loan
  if (agentId && loanId) {
    return NextResponse.json({ request: findRequest(agentId, loanId) ?? null });
  }
  return NextResponse.json({ requests: listRequests({ status, agentId }) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.agentId || !body.loanId) {
    return NextResponse.json({ error: "agentId และ loanId จำเป็น" }, { status: 400 });
  }
  const request = createRequest({
    agentId: body.agentId,
    loanId: body.loanId,
    plate: body.plate ?? "",
    lat: body.lat ?? null,
    lng: body.lng ?? null,
  });
  return NextResponse.json({ request }, { status: 201 });
}
