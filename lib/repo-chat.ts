// ==========================================
//  Chat store — เจ้าหน้าที่ ↔ พนักงานสนาม (1:1 ต่อพนักงาน)
//  In-memory prototype — resets on server restart
// ==========================================

export type ChatSender = "officer" | "agent";

export interface ChatMessage {
  id: string;
  agentId: string;
  sender: ChatSender;
  text: string;
  createdAt: string;
}

let nextId = 0;

function mk(agentId: string, sender: ChatSender, text: string, createdAt: string): ChatMessage {
  return { id: `MSG-${String(++nextId).padStart(4, "0")}`, agentId, sender, text, createdAt };
}

export const messages: ChatMessage[] = [
  mk("AGT-001", "officer", "พี่อนุชา ฝากตามเคส 25201601534 ISUZU D-Max ขาว ทะเบียน 1ผค6199 ด้วยครับ", "2026-06-23T01:10:00Z"),
  mk("AGT-001", "agent",   "รับทราบครับ กำลังลงพื้นที่ย่านบางนา เดี๋ยวอัปเดตให้", "2026-06-23T01:25:00Z"),
  mk("AGT-001", "agent",   "เจอรถแล้วครับ จอดอยู่หน้าบ้าน กำลังประสานเจ้าของ", "2026-06-23T02:40:00Z"),
  mk("AGT-002", "officer", "พี่สมเกียรติ เคสเชียงใหม่อัปเดตยังครับ", "2026-06-23T03:00:00Z"),
];

export function listByAgent(agentId: string): ChatMessage[] {
  return messages
    .filter((m) => m.agentId === agentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function send(agentId: string, sender: ChatSender, text: string): ChatMessage {
  const msg = mk(agentId, sender, text, new Date().toISOString());
  messages.push(msg);
  return msg;
}

/** จำนวนข้อความล่าสุดต่อพนักงาน (ใช้แสดงตัวอย่างในรายการ) */
export function lastMessageByAgent(agentId: string): ChatMessage | undefined {
  const list = listByAgent(agentId);
  return list[list.length - 1];
}
