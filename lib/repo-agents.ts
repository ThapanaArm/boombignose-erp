// ==========================================
//  Field Agent store (พนักงานสนาม)
//  In-memory prototype — resets on server restart
// ==========================================

export type AgentStatus = "available" | "busy" | "off";

export interface FieldAgent {
  id: string;
  name: string;
  phone: string;
  zone: string;
  status: AgentStatus;
  createdAt: string;
}

let nextId = 100;

export const agents: FieldAgent[] = [
  { name: "อนุชา ทองดี",   phone: "081-111-2222", zone: "กรุงเทพฯ และปริมณฑล", status: "available" },
  { name: "สมเกียรติ ภักดี", phone: "082-333-4444", zone: "ภาคเหนือ",            status: "busy" },
  { name: "ธีรพงษ์ แก้วมณี", phone: "083-555-6666", zone: "ภาคอีสาน",           status: "available" },
  { name: "วีระศักดิ์ พูนผล", phone: "084-777-8888", zone: "ภาคใต้",             status: "off" },
  { name: "ณัฐวุฒิ ศรีสุข",  phone: "085-999-0000", zone: "ภาคกลาง",           status: "available" },
].map((x, i) => ({
  ...x,
  id: `AGT-${String(i + 1).padStart(3, "0")}`,
  status: x.status as AgentStatus,
  createdAt: "2024-01-01T00:00:00Z",
}));

export function getAgentById(id: string): FieldAgent | undefined {
  return agents.find((a) => a.id === id);
}

export function createAgent(data: Omit<FieldAgent, "id" | "createdAt">): FieldAgent {
  const agent: FieldAgent = {
    ...data,
    id: `AGT-${String(++nextId).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  agents.push(agent);
  return agent;
}

export function updateAgent(id: string, data: Partial<Omit<FieldAgent, "id" | "createdAt">>): FieldAgent | null {
  const idx = agents.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  agents[idx] = { ...agents[idx], ...data };
  return agents[idx];
}

export function deleteAgent(id: string): boolean {
  const idx = agents.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  agents.splice(idx, 1);
  return true;
}
