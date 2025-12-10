"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Type definitions
export interface RawMaterialType {
  _id: string;
  name: string;
  unit: string;
  unitCost: number;
}

interface RawMaterialTypeContextType {
  types: RawMaterialType[];
  loading: boolean;
  error: string | null;

  fetchTypes: () => Promise<void>;
  createType: (data: any) => Promise<void>;
  updateType: (id: string, data: any) => Promise<void>;
  deleteType: (id: string) => Promise<void>;
}

// Create context
const RawMaterialTypeContext = createContext<RawMaterialTypeContextType>(
  {} as RawMaterialTypeContextType
);

// Hook to use context
export const useRawMaterialTypes = () => useContext(RawMaterialTypeContext);

// Provider
export const RawMaterialTypeProvider = ({ children }: { children: ReactNode }) => {
  const [types, setTypes] = useState<RawMaterialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all types on mount
  useEffect(() => {
    fetchTypes();
    console.log(types)
  }, []);

  // Fetch all types
  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/raw-material-types`);

      if (!res.ok) {
        throw new Error("Failed to load material types");
      }

      const data = await res.json();
      setTypes(data);
      console.log(types)
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new type
  const createType = async (formData: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-material-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create material type");
      }

      await fetchTypes(); // refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update existing type
  const updateType = async (id: string, formData: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-material-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update material type");
      }

      await fetchTypes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete type
  const deleteType = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/raw-material-types/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete material type");
      }

      await fetchTypes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RawMaterialTypeContext.Provider
      value={{
        types,
        loading,
        error,
        fetchTypes,
        createType,
        updateType,
        deleteType,
      }}
    >
      {children}
    </RawMaterialTypeContext.Provider>
  );
};
