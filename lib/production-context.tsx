"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type MaterialItem = {
  material: string;
  quantity: number;
};

export type Production = {
  _id: string;
  product: string;
  quantity: number;
  materials: MaterialItem[];
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProductionContextType = {
  productions: Production[];
  loading: boolean;
  error: string | null;
  fetchProductions: () => Promise<void>;
  addProduction: (data: { product: string; quantity: number; materials: MaterialItem[]; date?: string }) => Promise<Production | null>;
  deleteProduction: (id: string) => Promise<boolean>;
};

const ProductionContext = createContext<ProductionContextType>({} as ProductionContextType);

export const useProduction = () => useContext(ProductionContext);

export function ProductionProvider({ children }: { children: ReactNode }) {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/products/production`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch productions (${res.status})`);
      const response = await res.json();
      const productionData = response.success ? response.data : [];
      setProductions(Array.isArray(productionData) ? productionData : []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load productions");
      console.error("Fetch productions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProduction = async (payload: { product: string; quantity: number; materials: MaterialItem[]; date?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/products/production`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to add production (${res.status})`);
      const response = await res.json();
      const created: Production = response.data;
      setProductions((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Failed to add production");
      console.error("Add production error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduction = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/products/production/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete production (${res.status})`);
      setProductions((prev) => prev.filter((p) => p._id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete production");
      console.error("Delete production error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <ProductionContext.Provider value={{ productions, loading, error, fetchProductions, addProduction, deleteProduction }}>
      {children}
    </ProductionContext.Provider>
  );
}
