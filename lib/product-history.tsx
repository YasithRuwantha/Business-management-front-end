"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ===== Types ===== */

export interface ProductTypeRef {
  _id: string;
  name: string;
}

export interface ProductHistory {
  _id: string;
  type: ProductTypeRef;   // populated from backend
  quantity: number;
  date: string;
}

/* ===== Context Type ===== */

interface ProductHistoryContextType {
  histories: ProductHistory[];
  loading: boolean;
  error: string | null;

  fetchHistories: () => Promise<void>;
  createHistory: (data: {
    typeId: string;
    quantity: number;
    date?: string;
  }) => Promise<void>;
  updateHistory: (
    id: string,
    data: {
      typeId?: string;
      quantity?: number;
      date?: string;
    }
  ) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
}

const ProductHistoryContext = createContext<ProductHistoryContextType>(
  {} as ProductHistoryContextType
);

export const useProductHistory = () => useContext(ProductHistoryContext);

/* ===== Provider ===== */

export const ProductHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [histories, setHistories] = useState<ProductHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchHistories();
//   }, []);

  /* ===== API Calls ===== */

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/product-history`);
      if (!res.ok) throw new Error("Failed to fetch product history");
      const data = await res.json();
      console.log("product histories :", data)
      setHistories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product history");
    } finally {
      setLoading(false);
    }
  };

  const createHistory = async (data: {
    typeId: string;
    quantity: number;
    date?: string;
  }) => {
    try {
      const res = await fetch(`${backendUrl}/api/product-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create history");
      await fetchHistories();
    } catch (err: any) {
      setError(err.message || "Failed to create history");
    }
  };

  const updateHistory = async (
    id: string,
    data: {
      typeId?: string;
      quantity?: number;
      date?: string;
    }
  ) => {
    try {
      const res = await fetch(`${backendUrl}/api/product-history/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update history");
      await fetchHistories();
    } catch (err: any) {
      setError(err.message || "Failed to update history");
    }
  };

  const deleteHistory = async (id: string) => {
    console.log("deleteHistory runned :", id)
    try {
      const res = await fetch(`${backendUrl}/api/product-history/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete history");
      await fetchHistories();
    } catch (err: any) {
      setError(err.message || "Failed to delete history");
    }
  };

  return (
    <ProductHistoryContext.Provider
      value={{
        histories,
        loading,
        error,
        fetchHistories,
        createHistory,
        updateHistory,
        deleteHistory,
      }}
    >
      {children}
    </ProductHistoryContext.Provider>
  );
};
