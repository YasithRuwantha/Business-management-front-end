"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type MaterialItem = {
  rawMaterial: {
    _id: string
    name: string
    unit: string
  }
  quantity: number
}

export type ProductType = {
  _id: string
  name: string
  unit: string
}


export type Production = {
  producedQuantity: ReactNode;
  rawMaterials: MaterialItem[];
  _id: string;
  quantity: number;
  materials: MaterialItem[];
  date: string;
  createdAt?: string;
  updatedAt?: string;
  name: string
  product: ProductType   // ✅ OBJECT, not string

  
};

type ProductionContextType = {
  productions: Production[];
  loading: boolean;
  error: string | null;
  fetchProductions: () => Promise<void>;
  addProduction: (data: {
    product: string;
    quantity: number;
    materials: MaterialItem[];
    date?: string;
  }) => Promise<Production | null>;
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
      const res = await fetch(`${backendUrl}/api/productions`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch productions (${res.status})`);
      const data = await res.json();
      // console.log("fetch productions :", data)
      setProductions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load productions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduction = async (payload: {
    product: string;
    quantity: number;
    materials: MaterialItem[];
    date?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/productions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to add production (${res.status})`);
      const data = await res.json();
      setProductions((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to add production");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduction = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/productions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete production (${res.status})`);
      setProductions((prev) => prev.filter((p) => p._id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to delete production");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <ProductionContext.Provider
      value={{ productions, loading, error, fetchProductions, addProduction, deleteProduction }}
    >
      {children}
    </ProductionContext.Provider>
  );
}
