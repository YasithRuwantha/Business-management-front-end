"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// ===============================
// 📌 Interface definitions
// ===============================
export interface RawMaterial {
  _id: string;
  typeId: string;
  quantity: number;
  total: number;
}

interface RawMaterialContextType {
  materials: RawMaterial[];
  loading: boolean;
  error: string | null;

  fetchMaterials: () => Promise<void>;
  createMaterial: (data: any) => Promise<void>;
  updateMaterial: (id: string, data: any) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
}

// ===============================
// 📌 Create Context
// ===============================
const RawMaterialContext = createContext<RawMaterialContextType>(
  {} as RawMaterialContextType
);

// Hook
export const useRawMaterials = () => useContext(RawMaterialContext);

// ===============================
// 📌 Provider Component
// ===============================
export const RawMaterialProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all on mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  // ===============================
  // 📌 API: GET ALL
  // ===============================
  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${backendUrl}/api/raw-materials`);

      if (!res.ok) throw new Error("Failed to fetch materials");

      const data = await res.json();
      setMaterials(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 📌 API: CREATE
  // ===============================
  const createMaterial = async (formData: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create material");

      await fetchMaterials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ===============================
  // 📌 API: UPDATE
  // ===============================
  const updateMaterial = async (id: string, formData: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-materials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update material");

      await fetchMaterials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ===============================
  // 📌 API: DELETE
  // ===============================
  const deleteMaterial = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-materials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete material");

      await fetchMaterials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RawMaterialContext.Provider
      value={{
        materials,
        loading,
        error,
        fetchMaterials,
        createMaterial,
        updateMaterial,
        deleteMaterial,
      }}
    >
      {children}
    </RawMaterialContext.Provider>
  );
};
