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
  monthlyRevenue: any[];
  monthlySales: Number;
  yearlySales: Number;
  fetchSales: () => Promise<void>;
  addSale: (data: { customerId: string; items: { product: string; quantity: number; price: number }[]; note?: string; date?: string }) => Promise<Sale | null>;
  deleteSale: (id: string) => Promise<boolean>;
  fetchYearlyStats: (year: number) => Promise<void>;
  fetchMonthlyRevenue: (year: number) => Promise<void>;
  fetchTotalRevenueByYear: (year: Number, month: number) => Promise<any>;
  fetchSalesTotalMonthYear: () => Promise<void>;
};

const SalesContext = createContext<SalesContextType>({} as SalesContextType);

export const useSales = () => useContext(SalesContext);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [yearlySales, setYearlySales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);

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

  const addSale = async (payload: { customerId: string; items: { product: string; quantity: number; price: number }[]; note?: string; date?: string }) => {
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


  const deleteSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete sale (${res.status})`);
      setSales((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete sale");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyStats = async (year: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/sales/performance-yearly?year=${year}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch stats (${res.status})`);

      const data = await res.json();
      // console.log("Fetched yearly sales stats :", data);
      setStats(data?.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch sales stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyRevenue = async (year: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/api/sales/monthly-revenue?year=${year}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch revenue (${res.status})`);

      const data = await res.json();
      // console.log("Fetched monthly revenue :", data);
      setMonthlyRevenue(data?.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch revenue");
    } finally {
      setLoading(false);
    }
  };


  const fetchTotalRevenueByYear = async (year: number, month: number) => {
    try {
      const query = month ? `?year=${year}&month=${month}` : `?year=${year}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sales/total-revenue${query}`);
      const data = await res.json();
      return {
        totalRevenue: data.totalRevenue || 0,
        percentageChange: data.percentageChange || 0,
      };
    } catch (err) {
      console.error("Failed to fetch total revenue", err);
      return { totalRevenue: 0, percentageChange: 0 };
    }
  };


    const fetchSalesTotalMonthYear = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/sales/total-month-year`);
        if (!res.ok) throw new Error("Failed to fetch sales totals");
        const data = await res.json();
        // console.log("Fetched monthly and yearly sales :", data);
        setMonthlySales(data.monthlySales);
        setYearlySales(data.yearlySales);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


  // useEffect(() => {
  //   fetchMonthlyRevenue(2025);
  // }, []); 
  

  return (
    <SalesContext.Provider value={
      { 
        sales, 
        loading, 
        error, 
        monthlySales,
        yearlySales,
        fetchSales, 
        addSale, 
        deleteSale, 
        fetchYearlyStats,
        fetchMonthlyRevenue, 
        monthlyRevenue,
        fetchTotalRevenueByYear,
        fetchSalesTotalMonthYear     
      }
    }>
      {children}
    </SalesContext.Provider>
  );
}
