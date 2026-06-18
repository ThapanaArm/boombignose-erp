// ==========================================
//  BoomBigNose ERP — Shared Types
// ==========================================

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type ProductStatus = "Active" | "Low Stock" | "Out of Stock";

export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";

export type EmployeeStatus = "Active" | "On Leave";

export type BadgeVariant = "green" | "blue" | "orange" | "purple" | "red" | "muted";

export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  orders: number;
  spend: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorder: number;
  status: ProductStatus;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  due: string;
  status: InvoiceStatus;
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  position: string;
  salary: number;
  status: EmployeeStatus;
}
