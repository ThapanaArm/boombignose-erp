// ==========================================
//  Car Loan / Vehicle Repossession Store
//  In-memory prototype — resets on server restart
// ==========================================

export type LoanStatus =
  | "active"
  | "overdue"
  | "repossession"
  | "repossessed"
  | "settled";

export interface Loan {
  id: string;
  contractNo: string;
  borrowerName: string;
  borrowerIdNo: string;
  phone: string;
  vehicleInfo: string;
  licensePlate: string;
  loanAmount: number;
  monthlyPayment: number;
  startDate: string;
  endDate: string;
  overdueMonths: number;
  overdueAmount: number;
  status: LoanStatus;
  lastPaymentDate: string | null;
  notes: string;
  createdAt: string;
}

let nextId = 100;

export const loans: Loan[] = [
  {
    id: "LOAN-2024-001",
    contractNo: "CNT-2024-001",
    borrowerName: "สมชาย ใจดี",
    borrowerIdNo: "1-1001-23456-78-9",
    phone: "081-234-5678",
    vehicleInfo: "Toyota Fortuner 2.4G 4WD 2022 (สีขาว)",
    licensePlate: "กข-1234 กรุงเทพมหานคร",
    loanAmount: 1_200_000,
    monthlyPayment: 22_500,
    startDate: "2022-03-01",
    endDate: "2027-03-01",
    overdueMonths: 5,
    overdueAmount: 112_500,
    status: "repossession",
    lastPaymentDate: "2024-01-15",
    notes: "ติดต่อไม่ได้ 3 ครั้ง — ส่งจดหมายแจ้งเตือนแล้ว",
    createdAt: "2022-03-01T08:00:00Z",
  },
  {
    id: "LOAN-2024-002",
    contractNo: "CNT-2024-002",
    borrowerName: "วิไล สุขใจ",
    borrowerIdNo: "3-4002-56789-01-2",
    phone: "089-987-6543",
    vehicleInfo: "Honda CR-V 1.5 Turbo EL 4WD 2021 (สีดำ)",
    licensePlate: "คง-5678 เชียงใหม่",
    loanAmount: 980_000,
    monthlyPayment: 18_200,
    startDate: "2021-07-01",
    endDate: "2026-07-01",
    overdueMonths: 3,
    overdueAmount: 54_600,
    status: "overdue",
    lastPaymentDate: "2024-03-10",
    notes: "แจ้งเตือนทางโทรศัพท์ 2 ครั้ง",
    createdAt: "2021-07-01T08:00:00Z",
  },
  {
    id: "LOAN-2024-003",
    contractNo: "CNT-2024-003",
    borrowerName: "ประสิทธิ์ มีสุข",
    borrowerIdNo: "5-5003-34567-23-4",
    phone: "062-111-2222",
    vehicleInfo: "Isuzu D-Max 1.9 Ddi L 2020 (สีเทา)",
    licensePlate: "งจ-9012 ขอนแก่น",
    loanAmount: 750_000,
    monthlyPayment: 13_800,
    startDate: "2020-11-01",
    endDate: "2025-11-01",
    overdueMonths: 0,
    overdueAmount: 0,
    status: "active",
    lastPaymentDate: "2024-05-28",
    notes: "",
    createdAt: "2020-11-01T08:00:00Z",
  },
  {
    id: "LOAN-2024-004",
    contractNo: "CNT-2024-004",
    borrowerName: "นิรันดร์ แสงทอง",
    borrowerIdNo: "1-2004-45678-34-5",
    phone: "095-333-4444",
    vehicleInfo: "Mitsubishi Pajero Sport GT Premium 4WD 2023 (สีเงิน)",
    licensePlate: "ฉช-3456 นครราชสีมา",
    loanAmount: 1_550_000,
    monthlyPayment: 28_700,
    startDate: "2023-01-01",
    endDate: "2028-01-01",
    overdueMonths: 7,
    overdueAmount: 200_900,
    status: "repossessed",
    lastPaymentDate: "2023-11-05",
    notes: "ยึดรถแล้ว — รถอยู่ที่ลานจอด ซ.ลาดพร้าว 87",
    createdAt: "2023-01-01T08:00:00Z",
  },
  {
    id: "LOAN-2024-005",
    contractNo: "CNT-2024-005",
    borrowerName: "อารีย์ เพชรสวย",
    borrowerIdNo: "2-6005-56789-45-6",
    phone: "098-555-6666",
    vehicleInfo: "Mazda CX-5 2.0 C 2021 (สีแดง)",
    licensePlate: "ซฌ-7890 ภูเก็ต",
    loanAmount: 890_000,
    monthlyPayment: 16_500,
    startDate: "2021-05-01",
    endDate: "2026-05-01",
    overdueMonths: 0,
    overdueAmount: 0,
    status: "settled",
    lastPaymentDate: "2024-05-01",
    notes: "ปิดบัญชีครบถ้วน",
    createdAt: "2021-05-01T08:00:00Z",
  },
  {
    id: "LOAN-2024-006",
    contractNo: "CNT-2024-006",
    borrowerName: "บุญมา รักดี",
    borrowerIdNo: "3-8006-67890-56-7",
    phone: "086-777-8888",
    vehicleInfo: "Ford Ranger 2.0 Turbo Wildtrak 4WD 2022 (สีน้ำเงิน)",
    licensePlate: "ญฐ-1234 สุราษฎร์ธานี",
    loanAmount: 1_050_000,
    monthlyPayment: 19_400,
    startDate: "2022-09-01",
    endDate: "2027-09-01",
    overdueMonths: 2,
    overdueAmount: 38_800,
    status: "overdue",
    lastPaymentDate: "2024-03-28",
    notes: "รอการชำระงวดค้าง",
    createdAt: "2022-09-01T08:00:00Z",
  },
];

export function getLoanById(id: string): Loan | undefined {
  return loans.find((l) => l.id === id);
}

export function searchLoans(q: string): Loan[] {
  const query = q.toLowerCase().trim();
  if (!query) return [];
  return loans.filter(
    (l) =>
      l.contractNo.toLowerCase().includes(query) ||
      l.borrowerIdNo.replace(/-/g, "").includes(query.replace(/-/g, "")) ||
      l.licensePlate.toLowerCase().includes(query) ||
      l.borrowerName.toLowerCase().includes(query)
  );
}

export function createLoan(data: Omit<Loan, "id" | "createdAt">): Loan {
  const loan: Loan = {
    ...data,
    id: `LOAN-${new Date().getFullYear()}-${String(++nextId).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  loans.push(loan);
  return loan;
}

export function updateLoan(id: string, data: Partial<Omit<Loan, "id" | "createdAt">>): Loan | null {
  const idx = loans.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  loans[idx] = { ...loans[idx], ...data };
  return loans[idx];
}

export function deleteLoan(id: string): boolean {
  const idx = loans.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  loans.splice(idx, 1);
  return true;
}
