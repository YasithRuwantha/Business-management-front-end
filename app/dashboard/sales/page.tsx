"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, X, Plus, Loader2 } from "lucide-react";
import { useSales } from "@/lib/sales-context";
import { useCustomers } from "@/lib/customers-context";
import { useProducts } from "@/lib/product-context";
import { useRawMaterials } from "@/lib/raw-material-context";
interface MaterialItem {
  material: string;
  quantity: string;
}

interface ProductItem {
  product: string;
  quantity: string;
  materials: MaterialItem[];
  date: string;
}

export default function SalesPage() {
  const { sales, loading, error, addSale } = useSales();
  const { customers, loading: loadingCustomers } = useCustomers();
  const { types: productTypes, loading: loadingTypes } = useProductTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sales: [
      {
        customerId: "",
        items: [{ product: "", quantity: "", price: "" }],
        date: new Date().toISOString().split("T")[0],
      },
    ],
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);


  // Calculate total price for a sale
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  };

  // Sale-level handlers
  const addSaleField = () => setFormData({
    ...formData,
    sales: [
      ...formData.sales,
      {
        customerId: "",
        items: [{ product: "", quantity: "", price: "" }],
        date: new Date().toISOString().split("T")[0],
      },
    ],
  });

  const removeSaleField = (index) => {
    if (formData.sales.length > 1) {
      setFormData({ ...formData, sales: formData.sales.filter((_, i) => i !== index) });
    }
  };

  const updateSale = (index, field, value) => {
    const newSales = [...formData.sales];
    newSales[index] = { ...newSales[index], [field]: value };
    setFormData({ ...formData, sales: newSales });
  };

  // Item-level handlers
  const addItemField = (saleIdx) => {
    const newSales = [...formData.sales];
    newSales[saleIdx].items.push({ product: "", quantity: "", price: "" });
    setFormData({ ...formData, sales: newSales });
  };

  const removeItemField = (saleIdx, itemIdx) => {
    const newSales = [...formData.sales];
    if (newSales[saleIdx].items.length > 1) {
      newSales[saleIdx].items = newSales[saleIdx].items.filter((_, i) => i !== itemIdx);
      setFormData({ ...formData, sales: newSales });
    }
  };

  const updateItem = (saleIdx, itemIdx, field, value) => {
    const newSales = [...formData.sales];
    newSales[saleIdx].items[itemIdx] = { ...newSales[saleIdx].items[itemIdx], [field]: value };
    setFormData({ ...formData, sales: newSales });
  };

  // Submit multiple sales
  const handleAddSales = async (e) => {
    e.preventDefault();
    let successCount = 0;
    setSubmitting(true);
    try {
      for (const sale of formData.sales) {
        const validItems = sale.items.filter(i => i.product && i.quantity && i.price);
        if (!sale.customerId || validItems.length === 0) continue;
        const result = await addSale({
          customerId: sale.customerId,
          items: validItems.map(i => ({ product: i.product, quantity: Number(i.quantity), price: Number(i.price) })),
          date: sale.date,
        });
        if (result) successCount++;
      }
      if (successCount > 0) {
        setFormData({
          sales: [
            {
              customerId: "",
              items: [{ product: "", quantity: "", price: "" }],
              date: new Date().toISOString().split("T")[0],
            },
          ],
        });
        setIsModalOpen(false);
        fetchCustomers();
        alert(`${successCount} sale(s) recorded!`);
      }
    } catch (err) {
      alert("Error recording sales");
    } finally {
      setSubmitting(false);
    }
  };

  // Details Modal
  const viewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
  };

  // Remove Sale (dummy, implement as needed)
  const handleDelete = async (id) => {
    if (!confirm("Delete this sale?")) return;
    alert("Delete not implemented");
  };

  // UI Render
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">Record and manage sales with multiple items per order</p>
        </div>
        <Button onClick={handleOpenModal} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg">Record Sale(s)</Button>
      </div>


      {/* Sales Summary */}
      <Card className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-50">
        <div>
          <div className="text-lg text-muted-foreground">Total Sales Revenue</div>
          <div className="text-4xl font-bold text-blue-700">${sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-lg text-muted-foreground">Total Orders</div>
          <div className="text-4xl font-bold text-blue-700">{sales.length}</div>
        </div>
      </Card>

      {/* Record Multiple Sales Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card p-4 md:p-6 border-b flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Record Multiple Sales</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSales} className="p-4 md:p-6 space-y-8">
              {formData.sales.map((sale, si) => (
                <div key={`sale-form-${si}`} className="border border-border rounded-lg p-4 space-y-4 bg-secondary/20">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-foreground">Sale #{si + 1}</h4>
                    {formData.sales.length > 1 && <button type="button" onClick={() => removeSaleField(si)} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"><X size={18} /> Remove Sale</button>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Customer Name *</label>
                    <select value={sale.customerId} onChange={e => updateSale(si, "customerId", e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-base">
                      <option value="">Select customer...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Sale Date</label>
                    <Input type="date" value={sale.date} onChange={e => updateSale(si, "date", e.target.value)} />
                  </div>
                  {/* Ordered Items */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-semibold text-foreground">Ordered Items *</h5>
                      <button type="button" onClick={() => addItemField(si)} className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium"><Plus size={16}/> Add Item</button>
                    </div>
                    {sale.items.map((item, idx) => (
                      <div key={`sale-${si}-item-${idx}`} className="border border-border rounded-lg p-3 space-y-2 bg-secondary/10">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <select value={item.product} onChange={e => updateItem(si, idx, "product", e.target.value)} className="col-span-1 sm:col-span-6 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm">
                            <option value="">Select product...</option>
                            {products.map(p => {
                              // Calculate how much of this product is already entered in ALL sales/items in the modal
                              let usedQty = 0;
                              formData.sales.forEach((sale, saleIdx) => {
                                sale.items.forEach((itm, itmIdx) => {
                                  if (itm.product === p._id && !(saleIdx === si && itmIdx === idx)) {
                                    usedQty += Number(itm.quantity) || 0;
                                  }
                                });
                              });
                              const stockLeft = p.quantity - usedQty;
                              return (
                                <option key={p._id} value={p._id}>
                                  {p.typeId.name} ({p.typeId.unit}) - Stock: {stockLeft}
                                </option>
                              );
                            })}
                          </select>
                          {(() => {
                            const p = products.find(prod => prod._id === item.product);
                            if (!p) return (
                              <Input
                                type="number"
                                min="1"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={e => updateItem(si, idx, "quantity", e.target.value)}
                                className="col-span-1 sm:col-span-3 text-sm"
                              />
                            );
                            // Calculate how much of this product is already entered in ALL sales/items in the modal (excluding this item)
                            let usedQty = 0;
                            formData.sales.forEach((sale, saleIdx) => {
                              sale.items.forEach((itm, itmIdx) => {
                                if (itm.product === item.product && !(saleIdx === si && itmIdx === idx)) {
                                  usedQty += Number(itm.quantity) || 0;
                                }
                              });
                            });
                            const originalStock = p.quantity;
                            const availableQty = originalStock - usedQty;
                            const enteredQty = Number(item.quantity) || 0;
                            const afterUse = availableQty - enteredQty;
                            const isInsufficient = afterUse < 0;
                            return (
                              <div className="col-span-1 sm:col-span-3 flex flex-col gap-1">
                                <Input
                                  type="number"
                                  min="1"
                                  max={availableQty}
                                  placeholder="Qty"
                                  value={item.quantity}
                                  onChange={e => updateItem(si, idx, "quantity", e.target.value)}
                                  className={`text-sm ${isInsufficient ? 'border-red-500 focus:ring-red-500' : ''}`}
                                />
                                {item.product && (
                                  <div className="text-xs pl-1 space-y-0.5">
                                    <div className="text-muted-foreground">
                                      Current Stock: <span className="font-semibold text-blue-600">{availableQty} {p.typeId.unit}</span>
                                    </div>
                                    {enteredQty > 0 && (
                                      <div className="text-muted-foreground">
                                        {isInsufficient ? (
                                          <span className="font-semibold text-red-600">
                                            ⚠️ Insufficient! Need {Math.abs(afterUse).toFixed(2)} {p.typeId.unit} more
                                          </span>
                                        ) : (
                                          <>
                                            After Use: <span className="font-semibold text-blue-600">{afterUse.toFixed(2)} {p.typeId.unit} remaining</span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          <Input type="number" min="0" step="0.01" placeholder="Price" value={item.price} onChange={e => updateItem(si, idx, "price", e.target.value)} className="col-span-1 sm:col-span-3 text-sm" />
                          {sale.items.length > 1 && <button type="button" onClick={() => removeItemField(si, idx)} className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end text-red-600 hover:text-red-700"><Trash2 size={16} /></button>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end text-lg font-bold text-blue-700">Total: ${calculateTotal(sale.items).toFixed(2)}</div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <button type="button" onClick={addSaleField} className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"><Plus size={20}/> Add Another Sale</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Recording...</> : "Record Sale(s)"}
                </Button>
                <Button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="sm:flex-1 bg-secondary hover:bg-muted text-foreground">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-card">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Sale Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div><p className="text-sm text-muted-foreground">Sale ID</p><p className="text-lg md:text-xl font-semibold text-foreground">#{selectedSale.id?.slice(-6)}</p></div>
                <div><p className="text-sm text-muted-foreground">Customer</p><p className="text-lg md:text-xl font-semibold text-foreground">{selectedSale.customerName}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="text-lg md:text-xl font-semibold text-foreground">${selectedSale.totalAmount?.toFixed(2)}</p></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Ordered Items</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full min-w-max md:min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Product</th>
                        <th className="text-right py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Qty</th>
                        <th className="text-right py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Price</th>
                        <th className="text-right py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedSale.items) && selectedSale.items.length > 0 ? (
                        selectedSale.items.map((item, i) => (
                          <tr key={i} className="border-b hover:bg-secondary">
                            <td className="py-2 px-3"><span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{item.product}</span></td>
                            <td className="text-right py-2 px-3 font-semibold text-xs md:text-sm">{item.quantity}</td>
                            <td className="text-right py-2 px-3 font-semibold text-xs md:text-sm">${item.price?.toFixed(2)}</td>
                            <td className="text-right py-2 px-3 font-semibold text-xs md:text-sm">${item.total?.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="py-2 px-3 text-muted-foreground">No items</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <Button onClick={() => setShowDetailsModal(false)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Close</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Sales Orders Table */}
      {!loading && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Sales Orders</h2>
          {sales.length === 0 ? <div className="text-center py-12 text-muted-foreground">No sales records found.</div> : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Items</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Date</th>
                    <th className="text-center py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale, idx) => (
                    <tr key={`order-table-${sale.id || idx}`} className="hover:bg-secondary/20">
                      <td className="py-2 px-4">#{sale.id?.slice(-6)}</td>
                      <td className="py-2 px-4">
                        {sale.customerName}
                        {!customers.some(c => c.id === sale.customerId) && " (Removed Customer)"}
                      </td>
                      <td className="py-2 px-4">{sale.items.length} item(s)</td>
                      <td className="py-2 px-4 text-green-600 font-bold">${sale.totalAmount?.toFixed(2)}</td>
                      <td className="py-2 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => viewDetails(sale)}><Eye size={16}/></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(sale.id)}><Trash2 size={16}/></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

    </div>
  );
}
