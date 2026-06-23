// ==========================================
//  Credit Institution store (สถาบันสินเชื่อ)
//  In-memory prototype — resets on server restart
// ==========================================

export interface Institution {
  id: string;
  name: string;
  code: string;
  contactName: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

let nextId = 100;

export const institutions: Institution[] = [
  { name: "ธนชาต DRIVE", code: "TBANK", contactName: "ฝ่ายเร่งรัดหนี้สิน", phone: "02-217-8000" },
  { name: "กรุงศรี ออโต้", code: "KSA", contactName: "ฝ่ายติดตามทรัพย์", phone: "02-740-7400" },
  { name: "ทิสโก้ ออโต้", code: "TISCO", contactName: "ฝ่ายบริหารหนี้", phone: "02-633-6000" },
  { name: "เอสซีบี ลีสซิ่ง", code: "SCBL", contactName: "ฝ่ายยึดทรัพย์", phone: "02-544-1000" },
  { name: "เมืองไทย แคปปิตอล", code: "MTC", contactName: "ฝ่ายติดตาม", phone: "02-483-8888" },
].map((x, i) => ({
  ...x,
  id: `INS-${String(i + 1).padStart(3, "0")}`,
  active: true,
  createdAt: "2024-01-01T00:00:00Z",
}));

export function getInstitutionById(id: string): Institution | undefined {
  return institutions.find((x) => x.id === id);
}

export function createInstitution(data: Omit<Institution, "id" | "createdAt">): Institution {
  const inst: Institution = {
    ...data,
    id: `INS-${String(++nextId).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  institutions.push(inst);
  return inst;
}

export function updateInstitution(id: string, data: Partial<Omit<Institution, "id" | "createdAt">>): Institution | null {
  const idx = institutions.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  institutions[idx] = { ...institutions[idx], ...data };
  return institutions[idx];
}

export function deleteInstitution(id: string): boolean {
  const idx = institutions.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  institutions.splice(idx, 1);
  return true;
}
