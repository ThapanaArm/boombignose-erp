// ==========================================
//  Field Agent store (พนักงานสนาม)
//  In-memory prototype — resets on server restart
// ==========================================

export type AgentStatus = "available" | "busy" | "off";

export interface FieldAgent {
  id: string;
  name: string;
  username: string;
  password: string;     // demo only — never returned by the public GET
  email: string;
  phone: string;
  address: string;
  zone: string;
  newsletter: boolean;
  status: AgentStatus;
  createdAt: string;
}

/** Agent record safe to expose to the client (password removed). */
export type PublicAgent = Omit<FieldAgent, "password">;

export function sanitizeAgent(a: FieldAgent): PublicAgent {
  return {
    id: a.id, name: a.name, username: a.username, email: a.email, phone: a.phone,
    address: a.address, zone: a.zone, newsletter: a.newsletter, status: a.status, createdAt: a.createdAt,
  };
}

let nextId = 100;

export const agents: FieldAgent[] = [
  { name: "อนุชา ทองดี",    username: "anucha",    password: "1234", email: "anucha@autofinance.co.th",    phone: "081-111-2222", address: "เขตบางนา กรุงเทพฯ",   zone: "กรุงเทพฯ และปริมณฑล", status: "available" },
  { name: "สมเกียรติ ภักดี", username: "somkiat",   password: "1234", email: "somkiat@autofinance.co.th",   phone: "082-333-4444", address: "อ.เมือง เชียงใหม่",   zone: "ภาคเหนือ",            status: "busy" },
  { name: "ธีรพงษ์ แก้วมณี",  username: "teerapong", password: "1234", email: "teerapong@autofinance.co.th", phone: "083-555-6666", address: "อ.เมือง ขอนแก่น",    zone: "ภาคอีสาน",           status: "available" },
  { name: "วีระศักดิ์ พูนผล", username: "weerasak",  password: "1234", email: "weerasak@autofinance.co.th",  phone: "084-777-8888", address: "อ.หาดใหญ่ สงขลา",    zone: "ภาคใต้",             status: "off" },
  { name: "ณัฐวุฒิ ศรีสุข",   username: "nattawut",  password: "1234", email: "nattawut@autofinance.co.th",  phone: "085-999-0000", address: "อ.เมือง นครปฐม",     zone: "ภาคกลาง",           status: "available" },
].map((x, i) => ({
  ...x,
  id: `AGT-${String(i + 1).padStart(3, "0")}`,
  status: x.status as AgentStatus,
  newsletter: false,
  createdAt: "2024-01-01T00:00:00Z",
}));

export function getAgentById(id: string): FieldAgent | undefined {
  return agents.find((a) => a.id === id);
}

/** Find an agent by username/email (case-insensitive) or phone (digits only). */
export function findAgentByLogin(login: string): FieldAgent | undefined {
  const u = login.trim().toLowerCase();
  const digits = login.replace(/\D/g, "");
  return agents.find(
    (a) => a.username.toLowerCase() === u || a.email.toLowerCase() === u ||
      (digits.length >= 6 && a.phone.replace(/\D/g, "") === digits),
  );
}

/** True if the email or phone is already registered. */
export function isContactTaken(email: string, phone: string): boolean {
  const e = email.trim().toLowerCase();
  const p = phone.replace(/\D/g, "");
  return agents.some((a) => (!!e && a.email.toLowerCase() === e) || (p.length >= 6 && a.phone.replace(/\D/g, "") === p));
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
