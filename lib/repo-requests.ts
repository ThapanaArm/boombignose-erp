// ==========================================
//  Info Request store (คำขอข้อมูลรถเพิ่มเติม)
//  Field agent requests full vehicle details → officer approves →
//  full info + chat + photo upload unlocked.
//  In-memory prototype — resets on server restart.
// ==========================================

export type RequestStatus = "pending" | "approved" | "rejected";

export interface InfoRequest {
  id: string;
  agentId: string;
  loanId: string;
  plate: string;
  status: RequestStatus;
  photos: string[];          // data URLs (demo)
  lat: number | null;
  lng: number | null;
  note: string;
  createdAt: string;
  decidedAt: string | null;
}

let nextId = 0;

export const requests: InfoRequest[] = [
  // one seeded pending request so the officer screen isn't empty
  {
    id: "REQ-0001",
    agentId: "AGT-002",
    loanId: "LOAN-2024-003",
    plate: "งจ-9012",
    status: "pending",
    photos: [],
    lat: 18.7883,
    lng: 98.9853,
    note: "",
    createdAt: "2026-06-23T01:00:00Z",
    decidedAt: null,
  },
];
nextId = 1;

export function getRequestById(id: string): InfoRequest | undefined {
  return requests.find((r) => r.id === id);
}

/** Latest request by this agent for this loan (or undefined). */
export function findRequest(agentId: string, loanId: string): InfoRequest | undefined {
  return [...requests].reverse().find((r) => r.agentId === agentId && r.loanId === loanId);
}

export function listRequests(filter: { status?: RequestStatus; agentId?: string } = {}): InfoRequest[] {
  return requests.filter(
    (r) => (!filter.status || r.status === filter.status) && (!filter.agentId || r.agentId === filter.agentId),
  );
}

export function createRequest(data: { agentId: string; loanId: string; plate: string; lat?: number | null; lng?: number | null }): InfoRequest {
  const req: InfoRequest = {
    id: `REQ-${String(++nextId).padStart(4, "0")}`,
    agentId: data.agentId,
    loanId: data.loanId,
    plate: data.plate,
    status: "pending",
    photos: [],
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    note: "",
    createdAt: new Date().toISOString(),
    decidedAt: null,
  };
  requests.push(req);
  return req;
}

export function decideRequest(id: string, status: "approved" | "rejected"): InfoRequest | null {
  const req = getRequestById(id);
  if (!req) return null;
  req.status = status;
  req.decidedAt = new Date().toISOString();
  return req;
}

export function addPhoto(id: string, dataUrl: string): InfoRequest | null {
  const req = getRequestById(id);
  if (!req) return null;
  req.photos.push(dataUrl);
  return req;
}
