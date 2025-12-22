"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, X, Plus, Loader2 } from "lucide-react";
import { useProduction, type Production } from "@/lib/production-context";
import { useProductTypes } from "@/lib/product-type-context";
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

export default function ProductionPage() {
  const { productions, loading, error, addProduction, deleteProduction } = useProduction();
  const { types: productTypes, loading: loadingTypes } = useProductTypes();
  const { materials: rawMaterials, loading: loadingMaterials } = useRawMaterials();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    products: [
      { product: "", quantity: "", materials: [{ material: "", quantity: "" }], date: new Date().toISOString().split("T")[0] },
    ],
  });

  // ---------- Product & Material Functions ----------
  const addProductField = () => setFormData({
    ...formData,
    products: [...formData.products, { product: "", quantity: "", materials: [{ material: "", quantity: "" }], date: new Date().toISOString().split("T")[0] }],
  });

  const removeProductField = (index: number) => {
    if (formData.products.length > 1) {
      setFormData({ ...formData, products: formData.products.filter((_, i) => i !== index) });
    }
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  const addMaterialField = (productIndex: number) => {
    const newProducts = [...formData.products];
    newProducts[productIndex].materials.push({ material: "", quantity: "" });
    setFormData({ ...formData, products: newProducts });
  };

  const removeMaterialField = (productIndex: number, materialIndex: number) => {
    const newProducts = [...formData.products];
    if (newProducts[productIndex].materials.length > 1) {
      newProducts[productIndex].materials = newProducts[productIndex].materials.filter((_, i) => i !== materialIndex);
      setFormData({ ...formData, products: newProducts });
    }
  };

  const updateMaterial = (productIndex: number, materialIndex: number, field: string, value: string) => {
    const newProducts = [...formData.products];
    newProducts[productIndex].materials[materialIndex] = { ...newProducts[productIndex].materials[materialIndex], [field]: value };
    setFormData({ ...formData, products: newProducts });
  };

  // ---------- Form Submission ----------
  const handleAddProduction = async (e: React.FormEvent) => {
    e.preventDefault();

    const validProducts = formData.products.filter(p => p.product && p.quantity && p.materials.some(m => m.material && m.quantity));
    if (validProducts.length === 0) return alert("Please fill at least one complete product with materials");

    // Check stock across all products
    const insufficientMaterials: string[] = [];
    const usageMap = new Map<string, { total: number; unit: string; available: number }>();

    for (const product of validProducts) {
      for (const mat of product.materials) {
        if (mat.material && mat.quantity) {
          const rawMat = rawMaterials.find(r => r.rawMaterialType.name === mat.material);
          if (rawMat) {
            const qtyUsed = Number(mat.quantity);
            const existing = usageMap.get(mat.material);
            if (existing) existing.total += qtyUsed;
            else usageMap.set(mat.material, { total: qtyUsed, unit: rawMat.rawMaterialType.unit, available: rawMat.quantity });
          }
        }
      }
    }

    usageMap.forEach((usage, name) => {
      if (usage.total > usage.available) insufficientMaterials.push(`${name}: Total ${usage.total} ${usage.unit} exceeds stock ${usage.available} ${usage.unit}`);
    });

    if (insufficientMaterials.length > 0) {
      return alert("❌ Insufficient Stock!\n" + insufficientMaterials.join("\n"));
    }

    setSubmitting(true);
    try {
      let successCount = 0;
      for (const product of validProducts) {
        const materialsData = product.materials.filter(m => m.material && m.quantity).map(m => ({ material: m.material, quantity: Number(m.quantity) }));
        const result = await addProduction({ product: product.product, quantity: Number(product.quantity), materials: materialsData, date: product.date });
        if (result) successCount++;
      }

      if (successCount > 0) {
        setFormData({ products: [{ product: "", quantity: "", materials: [{ material: "", quantity: "" }], date: new Date().toISOString().split("T")[0] }] });
        setIsModalOpen(false);
        alert(`${successCount} production record(s) created!`);
      }
    } catch (err) {
      console.error(err);
      alert("Error recording production");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this production?")) return;
    const success = await deleteProduction(id);
    alert(success ? "Deleted successfully!" : "Delete failed");
  };

  const viewDetails = (record: Production) => { setSelectedProduction(record); setShowDetailsModal(true); };

  // ---------- Render ----------
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Production</h1>
          <p className="text-muted-foreground mt-1">Record production with multiple materials</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg">
          <Plus size={20} /> Record Production
        </Button>
      </div>

      {/* Loading/Error */}
      {loading && <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">{error}</div>}

      {/* Record Production Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card p-4 md:p-6 border-b flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Record Production</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddProduction} className="p-4 md:p-6 space-y-6">
              {formData.products.map((product, pi) => (
                <div key={pi} className="border border-border rounded-lg p-4 space-y-4 bg-secondary/20">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-foreground">Product #{pi + 1}</h4>
                    {formData.products.length > 1 && <button type="button" onClick={() => removeProductField(pi)} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"><X size={18} /> Remove Product</button>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
                    <select value={product.product} onChange={(e) => updateProduct(pi, "product", e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-base">
                      <option value="">Select product...</option>
                      {productTypes.map(t => <option key={t._id} value={t.name}>{t.name} ({t.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Quantity Made *</label>
                    <Input type="number" placeholder="0" value={product.quantity} onChange={(e) => updateProduct(pi, "quantity", e.target.value)} className="text-base" />
                  </div>

                  {/* Materials */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-semibold text-foreground">Materials Used *</h5>
                      <button type="button" onClick={() => addMaterialField(pi)} className="flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium"><Plus size={16}/> Add Material</button>
                    </div>
                    {product.materials.map((mat, mi) => {
                      const selectedMat = rawMaterials.find(r => r.rawMaterialType.name === mat.material);
                      const originalStock = selectedMat?.quantity || 0;
                      let prevUsage = 0;
                      for (let i = 0; i < pi; i++) {
                        formData.products[i].materials.forEach(pm => { if (pm.material === mat.material) prevUsage += Number(pm.quantity); });
                      }
                      for (let i = 0; i < mi; i++) { if (product.materials[i].material === mat.material) prevUsage += Number(product.materials[i].quantity); }
                      const availableQty = originalStock - prevUsage;
                      const remainingQty = availableQty - Number(mat.quantity || 0);
                      const isInsufficient = remainingQty < 0;

                      return (
                        <div key={mi} className="space-y-1">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <select value={mat.material} onChange={e => updateMaterial(pi, mi, "material", e.target.value)} className="col-span-1 sm:col-span-6 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm">
                              <option value="">Select material...</option>
                              {rawMaterials.map(r => <option key={r._id} value={r.rawMaterialType.name}>{r.rawMaterialType.name} ({r.rawMaterialType.unit})</option>)}
                            </select>
                            <Input type="number" step="0.01" placeholder="Qty" value={mat.quantity} onChange={e => updateMaterial(pi, mi, "quantity", e.target.value)} className={`col-span-1 sm:col-span-4 text-sm ${isInsufficient ? 'border-red-500 focus:ring-red-500' : ''}`} />
                            {product.materials.length > 1 && <button type="button" onClick={() => removeMaterialField(pi, mi)} className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end text-red-600 hover:text-red-700"><Trash2 size={16} /></button>}
                          </div>
                          {mat.material && <div className="text-xs pl-1 space-y-0.5">
                            <div className="text-muted-foreground">Current Stock: <span className={`font-semibold ${availableQty < 10 ? 'text-orange-600' : 'text-blue-600'}`}>{availableQty} {selectedMat?.rawMaterialType.unit}</span></div>
                            {isInsufficient && <div className="text-red-600 font-semibold text-xs">⚠️ Need {Math.abs(remainingQty).toFixed(2)} more</div>}
                          </div>}
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Production Date</label>
                    <Input type="date" value={product.date} onChange={e => updateProduct(pi, "date", e.target.value)} />
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <button type="button" onClick={addProductField} className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"><Plus size={20}/> Add Another Product</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" disabled={submitting} className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Recording...</> : "Record Production"}
                </Button>
                <Button type="button" onClick={() => setIsModalOpen(false)} disabled={submitting} className="sm:flex-1 bg-secondary hover:bg-muted text-foreground">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedProduction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-card">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Production Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div><p className="text-sm text-muted-foreground">Production ID</p><p className="text-lg md:text-xl font-semibold text-foreground">#{selectedProduction._id.slice(-6)}</p></div>
                <div><p className="text-sm text-muted-foreground">Product</p><p className="text-lg md:text-xl font-semibold text-foreground">{typeof selectedProduction.product === 'object' && selectedProduction.product !== null ? selectedProduction.product.name : selectedProduction.product}</p></div>
                <div><p className="text-sm text-muted-foreground">Quantity</p><p className="text-lg md:text-xl font-semibold text-foreground">{selectedProduction.quantity}</p></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Materials Used</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full min-w-max md:min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Material</th>
                        <th className="text-right py-2 px-3 font-semibold text-foreground text-xs md:text-sm">Qty Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedProduction.materials) && selectedProduction.materials.length > 0 ? (
                        selectedProduction.materials.map((mat, i) => (
                          <tr key={i} className="border-b hover:bg-secondary">
                            <td className="py-2 px-3"><span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{mat.material}</span></td>
                            <td className="text-right py-2 px-3 font-semibold text-xs md:text-sm">{mat.quantity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={2} className="py-2 px-3 text-muted-foreground">No materials</td></tr>
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

      {/* Production History */}
      {!loading && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Production History</h2>
          {productions.length === 0 ? <div className="text-center py-12 text-muted-foreground">No production records found.</div> : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Product</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Qty</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Materials</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Date</th>
                    <th className="text-center py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productions.map(prod => (
                    <tr key={prod._id} className="hover:bg-secondary/20">
                      <td className="py-2 px-4">#{prod._id.slice(-6)}</td>
                      <td className="py-2 px-4">{typeof prod.product === 'object' && prod.product !== null ? prod.product.name : prod.product}</td>
                      <td className="py-2 px-4">{prod.quantity}</td>
                      <td className="py-2 px-4">{Array.isArray(prod.materials) ? prod.materials.length : 0}</td>
                      <td className="py-2 px-4">{new Date(prod.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => viewDetails(prod)}><Eye size={16}/></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(prod._id)}><Trash2 size={16}/></Button>
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
