// lib/sales-history.tsx
// This file will contain logic for the Sales History page/component.
// You can import this in your sales dashboard or use it as a standalone page/component.


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ModalOverlay } from "@/components/modal-overlay";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface SalesHistoryItem {
  _id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  note?: string;
  date: string;
}

export function useSalesHistory() {
  const [history, setHistory] = useState<SalesHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/sales-history`);
      if (!res.ok) throw new Error("Failed to fetch sales history");
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSalesHistory = async (id: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/sales-history/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sales history");
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, error, fetchHistory, deleteSalesHistory };
}

export default function SalesHistory() {
  const { history, loading, error, deleteSalesHistory } = useSalesHistory();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteSalesHistory(deleteId);
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Sales History</h2>
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No sales history found.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-max md:min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">ID</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Customer</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Items</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Amount</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Date</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-secondary/10">
                  <td className="py-2 px-3">#{sale.saleId?.slice(-6)}</td>
                  <td className="py-2 px-3">{sale.customerName}</td>
                  <td className="py-2 px-3">{sale.items.length} item(s)</td>
                  <td className="py-2 px-3 text-green-600 font-bold">${sale.totalAmount?.toFixed(2)}</td>
                  <td className="py-2 px-3">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => {
                        setDeleteId(sale._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

  );
}
