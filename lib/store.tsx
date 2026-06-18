"use client";

// ==========================================
//  BoomBigNose ERP — In-memory data store
//
//  React Context provider holding all ERP collections plus CRUD
//  actions. Mounted at the admin shell layout so state persists while
//  navigating between modules (resets on full page reload — prototype).
// ==========================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Customer,
  Product,
  Order,
  Invoice,
  Employee,
  OrderStatus,
  ProductStatus,
} from "./types";
import {
  CUSTOMERS,
  PRODUCTS,
  seedOrders,
  seedInvoices,
  seedEmployees,
} from "./data";

interface NewProductInput {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorder: number;
}

interface ErpContextValue {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  employees: Employee[];
  addOrder: (customer: string, product: string, qty: number, status: OrderStatus) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addCustomer: (c: Omit<Customer, "id" | "orders" | "spend">) => void;
  deleteCustomer: (id: number) => void;
  addProduct: (p: NewProductInput) => void;
  deleteProduct: (id: number) => void;
  addInvoice: (customer: string, amount: number, due: string) => void;
  addEmployee: (e: { name: string; dept: string; position: string; salary: number }) => void;
}

const ErpContext = createContext<ErpContextValue | null>(null);

export function ErpProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices);
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);

  const addOrder = useCallback(
    (customer: string, product: string, qty: number, status: OrderStatus) => {
      setOrders((prev) => {
        const p = products.find((x) => x.name === product);
        const order: Order = {
          id: `ORD-${String(1000 + prev.length + 1).padStart(5, "0")}`,
          customer,
          product,
          qty,
          total: (p?.price ?? 0) * qty,
          status,
          date: new Date().toISOString().slice(0, 10),
        };
        return [order, ...prev];
      });
    },
    [products]
  );

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const addCustomer = useCallback((c: Omit<Customer, "id" | "orders" | "spend">) => {
    setCustomers((prev) => [...prev, { ...c, id: Date.now(), orders: 0, spend: 0 }]);
  }, []);

  const deleteCustomer = useCallback((id: number) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addProduct = useCallback((p: NewProductInput) => {
    const status: ProductStatus =
      p.stock === 0 ? "Out of Stock" : p.stock <= p.reorder ? "Low Stock" : "Active";
    setProducts((prev) => [...prev, { ...p, id: Date.now(), status }]);
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addInvoice = useCallback((customer: string, amount: number, due: string) => {
    setInvoices((prev) => [
      {
        id: `INV-${String(2600 + prev.length + 1).padStart(5, "0")}`,
        customer,
        amount,
        due,
        status: "Unpaid",
      },
      ...prev,
    ]);
  }, []);

  const addEmployee = useCallback(
    (e: { name: string; dept: string; position: string; salary: number }) => {
      setEmployees((prev) => [
        ...prev,
        { ...e, id: `EMP-${String(100 + prev.length + 1)}`, status: "Active" },
      ]);
    },
    []
  );

  const value: ErpContextValue = {
    orders,
    customers,
    products,
    invoices,
    employees,
    addOrder,
    updateOrderStatus,
    addCustomer,
    deleteCustomer,
    addProduct,
    deleteProduct,
    addInvoice,
    addEmployee,
  };

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
}

export function useErp(): ErpContextValue {
  const ctx = useContext(ErpContext);
  if (!ctx) throw new Error("useErp must be used within an ErpProvider");
  return ctx;
}
