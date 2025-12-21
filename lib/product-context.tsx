"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface MaterialItem {
  material: string;
  quantity: number;
}

export interface Product {
  _id: string;
  typeId: {
    name: string;
    unit: string;
    _id: string;
  }
  quantity: number;
  date: string;
  materials?: MaterialItem[];
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/products`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
      console.log("products :", data)
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData: Partial<Product>) => {
    try {
      const res = await fetch(`${backendUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const data = await res.json();
      await fetchProducts();
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      return null;
    }
  };

  const updateProduct = async (id: string, formData: Partial<Product>) => {
    console.log("update runned :", id, formData)
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
