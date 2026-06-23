import { NextRequest, NextResponse } from "next/server";
import { loans, createLoan } from "@/lib/repo-store";

export function GET() {
  return NextResponse.json({ loans });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const loan = createLoan({
    contractNo: body.contractNo ?? "",
    borrowerName: body.borrowerName ?? "",
    borrowerIdNo: body.borrowerIdNo ?? "",
    phone: body.phone ?? "",
    company: body.company ?? "",
    vehicleInfo: body.vehicleInfo ?? "",
    licensePlate: body.licensePlate ?? "",
    chassisNo: body.chassisNo ?? "",
    loanAmount: Number(body.loanAmount) || 0,
    monthlyPayment: Number(body.monthlyPayment) || 0,
    startDate: body.startDate ?? "",
    endDate: body.endDate ?? "",
    overdueMonths: Number(body.overdueMonths) || 0,
    overdueAmount: Number(body.overdueAmount) || 0,
    status: body.status ?? "active",
    lastPaymentDate: body.lastPaymentDate || null,
    notes: body.notes ?? "",
  });
  return NextResponse.json({ loan }, { status: 201 });
}
