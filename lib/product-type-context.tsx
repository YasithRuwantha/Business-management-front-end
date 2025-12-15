"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ProductType {
  _id: string;
  name: string;
  unit: string;
  description?: string;
}

interface ProductTypeContextType {
  types: ProductType[];
  loading: boolean;
  error: string | null;

  fetchTypes: () => Promise<void>;
  createType: (data: Partial<ProductType>) => Promise<void>;
  updateType: (id: string, data: Partial<ProductType>) => Promise<void>;
  deleteType: (id: string) => Promise<void>;
}

const ProductTypeContext = createContext<ProductTypeContextType>({} as ProductTypeContextType);

export const useProductTypes = () => useContext(ProductTypeContext);

export const ProductTypeProvider = ({ children }: { children: ReactNode }) => {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/product-types`);
      if (!res.ok) throw new Error("Failed to load product types");
      const data = await res.json();
      setTypes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load product types");
    } finally {
      setLoading(false);
    }
  };

  const createType = async (formData: Partial<ProductType>) => {
    try {
      const res = await fetch(`${backendUrl}/api/product-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create product type");
      await fetchTypes();
    } catch (err: any) {
      setError(err.message || "Failed to create product type");
    }
  };

  const updateType = async (id: string, formData: Partial<ProductType>) => {
    try {
      const res = await fetch(`${backendUrl}/api/product-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update product type");
      await fetchTypes();
    } catch (err: any) {
      setError(err.message || "Failed to update product type");
    }
  };

  const deleteType = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/product-types/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product type");
      await fetchTypes();
    } catch (err: any) {
      setError(err.message || "Failed to delete product type");
    }
  };

  return (
    <ProductTypeContext.Provider
      value={{ types, loading, error, fetchTypes, createType, updateType, deleteType }}
    >
      {children}
    </ProductTypeContext.Provider>
  );
};
