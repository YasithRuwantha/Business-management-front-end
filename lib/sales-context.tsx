"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type SaleItem = {
  product: string;
  quantity: number;
  price: number;
  total: number;
};

export type Sale = {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  note?: string;
  date: string;
};

type SalesContextType = {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (data: { customerId: string; items: { product: string; quantity: number; price: number }[]; note?: string }) => Promise<Sale | null>;
};

const SalesContext = createContext<SalesContextType>({} as SalesContextType);

export const useSales = () => useContext(SalesContext);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/sales`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch sales (${res.status})`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : data?.sales ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (payload: { customerId: string; items: { product: string; quantity: number; price: number }[]; note?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to add sale (${res.status})`);
      const created: Sale = await res.json();
      setSales((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Failed to add sale");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SalesContext.Provider value={{ sales, loading, error, fetchSales, addSale }}>
      {children}
    </SalesContext.Provider>
  );
}
