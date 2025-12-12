"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// ===============================
// 📌 Interface definitions
// ===============================
export interface RawMaterialPurchase {
  _id: string;
  purchaseDate: string; // ISO string
  cost: number;
  purchaseQuantity: number
  typeId: {
    _id: string;
    name: string;
    unit: string;
    unitCost?: number;
  };
}

interface RawMaterialPurchaseContextType {
  purchases: RawMaterialPurchase[];
  loading: boolean;
  error: string | null;

  fetchPurchases: () => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
}

// ===============================
// 📌 Create Context
// ===============================
const RawMaterialPurchaseContext = createContext<RawMaterialPurchaseContextType>(
  {} as RawMaterialPurchaseContextType
);

// Hook to use context
export const useRawMaterialPurchases = () => useContext(RawMaterialPurchaseContext);

// ===============================
// 📌 Provider Component
// ===============================
export const RawMaterialPurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [purchases, setPurchases] = useState<RawMaterialPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch purchases on mount
  useEffect(() => {
    fetchPurchases();
  }, []);

  // ===============================
  // 📌 API: GET ALL PURCHASE HISTORY
  // ===============================
  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${backendUrl}/api/raw-material-purchases`);

      if (!res.ok) throw new Error("Failed to fetch purchase history");

      const data = await res.json();
      console.log("purchases :", data)
      setPurchases(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (id: string) => {
    await fetch(`${backendUrl}/api/raw-material-purchases/${id}`, {
        method: "DELETE",
    });
    fetchPurchases(); // refresh history
    };

  return (
    <RawMaterialPurchaseContext.Provider
      value={{
        purchases,
        loading,
        error,
        fetchPurchases,
        deletePurchase
      }}
    >
      {children}
    </RawMaterialPurchaseContext.Provider>
  );
};
