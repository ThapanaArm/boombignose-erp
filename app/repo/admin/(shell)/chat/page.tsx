"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FieldAgent } from "@/lib/repo-agents";
import type { ChatMessage } from "@/lib/repo-chat";

const zoneColor: Record<string, string> = {
  available: "var(--green)", busy: "var(--orange)", off: "var(--muted)",
};

export default function ChatPage() {
  const [agents, setAgents] = useState<FieldAgent[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/repo/agents").then((r) => r.json()).then((d) => {
      setAgents(d.agents);
      if (d.agents.length) setActiveId((cur) => cur ?? d.agents[0].id);
    });
  }, []);

  const loadMessages = useCallback((agentId: string) => {
    fetch(`/api/repo/chat/${agentId}`).then((r) => r.json()).then((d) => setMessages(d.messages));
  }, []);

  // Poll the active conversation every 3s
  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const t = setInterval(() => loadMessages(activeId), 3000);
    return () => clearInterval(t);
  }, [activeId, loadMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const post = async (sender: "officer" | "agent", body: string) => {
    if (!activeId || !body.trim()) return;
    setSending(true);
    await fetch(`/api/repo/chat/${activeId}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, text: body }),
    });
    setSending(false);
    loadMessages(activeId);
  };

  const sendOfficer = async () => {
    const body = text;
    setText("");
    await post("officer", body);
  };

  const activeAgent = agents.find((a) => a.id === activeId);
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="table-card" style={{ padding: 0, overflow: "hidden", height: "calc(100vh - 150px)" }}>
      <div style={{ display: "flex", height: "100%" }}>
        {/* Agent list */}
        <div style={{ width: 280, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>
            💬 พนักงานสนาม
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {agents.map((a) => {
              const active = a.id === activeId;
              return (
                <button key={a.id} onClick={() => setActiveId(a.id)}
                  style={{
                    width: "100%", textAlign: "left", padding: "12px 18px", border: "none",
                    borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: active ? "var(--surface2)" : "transparent", color: "var(--text)",
                    display: "flex", gap: 10, alignItems: "center",
                  }}>
                  <div style={{ position: "relative" }}>
                    <div className="avatar" style={{ width: 38, height: 38 }}>{a.name.charAt(0)}</div>
                    <span style={{ position: "absolute", right: -1, bottom: -1, width: 11, height: 11, borderRadius: "50%", background: zoneColor[a.status], border: "2px solid var(--surface)" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.zone}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {activeAgent ? (
            <>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar" style={{ width: 34, height: 34 }}>{activeAgent.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{activeAgent.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{activeAgent.zone} · {activeAgent.phone}</div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10, background: "var(--bg)" }}>
                {messages.map((m) => {
                  const mine = m.sender === "officer";
                  return (
                    <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                      <div style={{
                        background: mine ? "var(--primary, #6366f1)" : "var(--surface)",
                        color: mine ? "#fff" : "var(--text)",
                        border: mine ? "none" : "1px solid var(--border)",
                        borderRadius: 12, padding: "9px 13px", fontSize: 14, lineHeight: 1.45, wordBreak: "break-word",
                      }}>
                        {m.text}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: mine ? "right" : "left" }}>
                        {mine ? "เจ้าหน้าที่" : activeAgent.name} · {fmtTime(m.createdAt)}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <div style={{ margin: "auto", color: "var(--muted)", fontSize: 13 }}>ยังไม่มีข้อความ — เริ่มสนทนาได้เลย</div>
                )}
                <div ref={endRef} />
              </div>

              <div style={{ borderTop: "1px solid var(--border)", padding: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendOfficer(); }}
                  placeholder="พิมพ์ข้อความถึงพนักงานสนาม..."
                  style={{ flex: 1, border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", background: "var(--surface2)", color: "var(--text)", fontSize: 14, outline: "none" }}
                />
                <button className="btn btn-outline btn-sm" disabled={sending} title="จำลองข้อความตอบกลับจากพนักงาน"
                  onClick={() => post("agent", "รับทราบครับ กำลังดำเนินการ 👍")}>
                  จำลองตอบกลับ
                </button>
                <button className="btn btn-primary" disabled={sending || !text.trim()} onClick={sendOfficer}>ส่ง</button>
              </div>
            </>
          ) : (
            <div style={{ margin: "auto", color: "var(--muted)" }}>เลือกพนักงานสนามเพื่อเริ่มแชท</div>
          )}
        </div>
      </div>
    </div>
  );
}
