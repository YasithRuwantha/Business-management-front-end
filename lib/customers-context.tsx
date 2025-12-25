"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalSpent: number;
  orderCount: number;
};

type CustomersContextType = {
  customers: Customer[];
  yearlyTopCustomers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (data: Pick<Customer, "name" | "phone" | "address">) => Promise<Customer | null>;
  deleteCustomer: (id: string) => Promise<void>;
  fetchYearlyTopCustomers: (limit?: number) => Promise<void>; 

};

const CustomersContext = createContext<CustomersContextType>({} as CustomersContextType);

export const useCustomers = () => useContext(CustomersContext);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [yearlyTopCustomers, setYearlyTopCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/customers`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : data?.customers ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (payload: Pick<Customer, "name" | "phone" | "address">) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 409) throw new Error("Phone already exists");
        throw new Error(`Failed to add customer (${res.status})`);
      }
      const created: Customer = await res.json();
      setCustomers((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Failed to add customer");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete customer (${res.status})`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyTopCustomers = async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/api/customers/getTopSpendCustomersYearly`, );
      if (!res.ok) throw new Error(`Failed to fetch top customers (${res.status})`);
      const data = await res.json();
      // console.log("Fetched Yearly Top Customers:", data);
      setYearlyTopCustomers(Array.isArray(data) ? data : data?.customers ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load top customers");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomersContext.Provider
      value={{ customers, yearlyTopCustomers, loading, error, fetchCustomers, addCustomer, deleteCustomer, fetchYearlyTopCustomers }}
    >
      {children}
    </CustomersContext.Provider>
  );
}
