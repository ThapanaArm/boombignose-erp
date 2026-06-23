// ==========================================
//  Repossession Job store (งานยึดรถ)
//  In-memory prototype — resets on server restart
//  A Job = one repossession task created from a loan contract
//  (e.g. imported in bulk from a PDF batch list).
// ==========================================

export type JobStatus =
  | "new"          // เพิ่งสร้าง ยังไม่มอบหมาย
  | "assigned"     // มอบหมายพนักงานสนามแล้ว
  | "in_progress"  // กำลังลงพื้นที่
  | "found"        // พบรถแล้ว
  | "repossessed"  // ยึดรถสำเร็จ
  | "closed"       // ปิดงาน
  | "cancelled";   // ยกเลิก

export interface Job {
  id: string;
  jobNo: string;
  contractNo: string;
  borrowerName: string;
  debtAmount: number;
  brand: string;
  model: string;
  overdueInfo: string;     // เช่น "(48-47)-1" จากเอกสารต้นฉบับ
  statusCode: string;      // รหัสสถานะจากเอกสารต้นฉบับ เช่น "75"
  color: string;
  chassisNo: string;
  licensePlate: string;
  institutionId: string | null;
  assignedAgentId: string | null;
  status: JobStatus;
  source: "pdf" | "manual";
  notes: string;
  createdAt: string;
}

export type JobInput = Omit<Job, "id" | "jobNo" | "createdAt">;

let nextId = 0;

function makeJob(data: Partial<JobInput>): Job {
  const seq = ++nextId;
  return {
    id: `JOBID-${String(seq).padStart(4, "0")}`,
    jobNo: `JOB-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`,
    contractNo: data.contractNo ?? "",
    borrowerName: data.borrowerName ?? "",
    debtAmount: Number(data.debtAmount) || 0,
    brand: data.brand ?? "",
    model: data.model ?? "",
    overdueInfo: data.overdueInfo ?? "",
    statusCode: data.statusCode ?? "",
    color: data.color ?? "",
    chassisNo: data.chassisNo ?? "",
    licensePlate: data.licensePlate ?? "",
    institutionId: data.institutionId ?? null,
    assignedAgentId: data.assignedAgentId ?? null,
    status: (data.status as JobStatus) ?? (data.assignedAgentId ? "assigned" : "new"),
    source: data.source ?? "manual",
    notes: data.notes ?? "",
    createdAt: new Date().toISOString(),
  };
}

const SEED: Partial<JobInput>[] = [
  {
    contractNo: "25201601534", borrowerName: "น.ส.จันทร์เพ็ญ มากดี", debtAmount: 23847,
    brand: "ISUZU", model: "D-Max", overdueInfo: "(48-47)-1", statusCode: "75", color: "ขาว",
    chassisNo: "MP1FR86JE007738", licensePlate: "1ผค6199", institutionId: "INS-001",
    assignedAgentId: "AGT-001", status: "in_progress", source: "pdf", notes: "",
  },
  {
    contractNo: "25201601535", borrowerName: "นายธีรวัฒน์ อังคนาวิน", debtAmount: 91869,
    brand: "ISUZU", model: "Hilux Vigo Champ", overdueInfo: "(2-7)-5", statusCode: "75", color: "ดำ",
    chassisNo: "MR0GR58G60K081093", licensePlate: "ผก1199", institutionId: "INS-002",
    assignedAgentId: null, status: "new", source: "pdf", notes: "",
  },
  {
    contractNo: "25201601542", borrowerName: "นายปวริศ สังข์ทอง", debtAmount: 374645,
    brand: "TOYOTA", model: "Hilux Vigo", overdueInfo: "(76-39)-37", statusCode: "75", color: "เทา",
    chassisNo: "MR0FR22G70K560903", licensePlate: "5199", institutionId: "INS-003",
    assignedAgentId: "AGT-003", status: "repossessed", source: "pdf", notes: "รถอยู่ลานจอด",
  },
];

export const jobs: Job[] = SEED.map((x) => makeJob(x));

export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function createJob(data: Partial<JobInput>): Job {
  const job = makeJob({ ...data, source: data.source ?? "manual" });
  jobs.push(job);
  return job;
}

export function createJobsBulk(rows: Partial<JobInput>[]): Job[] {
  const created = rows.map((r) => makeJob({ ...r, source: r.source ?? "pdf" }));
  jobs.push(...created);
  return created;
}

export function updateJob(id: string, data: Partial<JobInput>): Job | null {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], ...data };
  return jobs[idx];
}

export function deleteJob(id: string): boolean {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return false;
  jobs.splice(idx, 1);
  return true;
}
