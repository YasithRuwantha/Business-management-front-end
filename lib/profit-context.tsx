"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------- TYPES ---------- */
export interface ProfitBlock {
  revenue: number;
  cost: number;
  profit: number;
}

export interface ProfitSummary {
  allTime: ProfitBlock;
  currentYear: ProfitBlock;
  currentMonth: ProfitBlock;
}

interface ProfitContextType {
  profit: ProfitSummary | null;
  loading: boolean;
  error: string | null;
  fetchProfitSummary: () => Promise<void>;
}

/* ---------- CONTEXT ---------- */
const ProfitContext = createContext<ProfitContextType>(
  {} as ProfitContextType
);

export const useProfit = () => useContext(ProfitContext);

/* ---------- PROVIDER ---------- */
export const ProfitProvider = ({ children }: { children: ReactNode }) => {
  const [profit, setProfit] = useState<ProfitSummary | null>(null);
  const [profitChart, setProfitChart] = useState<ProfitSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfitSummary = async () => {

    console.log("Fetching profit summary...");
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${backendUrl}/api/reports/profit-summary`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch profit summary (${res.status})`);
      }

      const data = await res.json();
      console.log("Fetched profit summary :", data);
      setProfit(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch profit summary");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentYearMonthlyProfitChart = async () => {
    console.log("Fetching profit summary...");

    try {
        setLoading(true);
        setError(null);

        const res = await fetch(
        `${backendUrl}/api/reports/monthly-profit-current-year-chart`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
            cache: "no-store",
        }
        );

        if (!res.ok) {
        throw new Error(`Failed to fetch monthly-profit-current-year-chart (${res.status})`);
        }

        const data = await res.json();
        console.log(" Fetched monthly-profit-current-year-chart data :", data);

        console.log("Fetched monthly-profit-current-year-chart :", data);
        setProfitChart(data);

    } catch (err: any) {
        console.error("Profit monthly-profit-current-year-chart :", err);
        setError(err?.message ?? "Failed to fetch monthly-profit-current-year-chart");
    } finally {
        setLoading(false);
    }
    };


  useEffect(() => {
    getCurrentYearMonthlyProfitChart();
  }, []);

  return (
    <ProfitContext.Provider
      value={{
        profit,
        loading,
        error,
        fetchProfitSummary,
      }}
    >
      {children}
    </ProfitContext.Provider>
  );
};
