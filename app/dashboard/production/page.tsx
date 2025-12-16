"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, X, Plus, Loader2 } from "lucide-react"
import { useProduction, type Production } from "@/lib/production-context"
import { useProductTypes } from "@/lib/product-type-context"
import { useRawMaterials } from "@/lib/raw-material-context"

interface MaterialItem {
  material: string
  quantity: string
}

interface ProductItem {
  product: string
  quantity: string
  materials: MaterialItem[]
  date: string
}

export default function ProductionPage() {
  const { productions, loading, error, addProduction, deleteProduction } = useProduction()
  const { types: productTypes, loading: loadingTypes } = useProductTypes()
  const { materials: rawMaterials, loading: loadingMaterials } = useRawMaterials()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    products: [
      {
        product: "",
        quantity: "",
        materials: [{ material: "", quantity: "" }],
        date: new Date().toISOString().split("T")[0],
      },
    ],
  })

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { product: "", quantity: "", materials: [{ material: "", quantity: "" }], date: new Date().toISOString().split("T")[0] },
      ],
    })
  }

  const removeProductField = (productIndex: number) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter((_, i) => i !== productIndex),
      })
    }
  }

  const updateProduct = (productIndex: number, field: string, value: string) => {
    const newProducts = [...formData.products]
    newProducts[productIndex] = { ...newProducts[productIndex], [field]: value }
    setFormData({ ...formData, products: newProducts })
  }

  const addMaterialField = (productIndex: number) => {
    const newProducts = [...formData.products]
    newProducts[productIndex].materials = [
      ...newProducts[productIndex].materials,
      { material: "", quantity: "" },
    ]
    setFormData({ ...formData, products: newProducts })
  }

  const removeMaterialField = (productIndex: number, materialIndex: number) => {
    const newProducts = [...formData.products]
    if (newProducts[productIndex].materials.length > 1) {
      newProducts[productIndex].materials = newProducts[productIndex].materials.filter(
        (_, i) => i !== materialIndex
      )
      setFormData({ ...formData, products: newProducts })
    }
  }

  const updateMaterial = (productIndex: number, materialIndex: number, field: string, value: string) => {
    const newProducts = [...formData.products]
    newProducts[productIndex].materials[materialIndex] = {
      ...newProducts[productIndex].materials[materialIndex],
      [field]: value,
    }
    setFormData({ ...formData, products: newProducts })
  }

  const handleAddProduction = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all products
    const validProducts = formData.products.filter((p) => {
      const validMaterials = p.materials.filter((m) => m.material && m.quantity)
      return p.product && p.quantity && validMaterials.length > 0
    })

    if (validProducts.length === 0) {
      alert("Please fill in at least one complete product with materials")
      return
    }

    // Check for insufficient stock - Calculate cumulative usage across all products
    const insufficientMaterials: string[] = []
    const materialUsageMap = new Map<string, { total: number; unit: string; available: number }>()
    
    // Calculate total usage for each material across all products
    for (const productData of validProducts) {
      for (const material of productData.materials) {
        if (material.material && material.quantity) {
          const selectedMaterial = rawMaterials.find(
            (rm) => rm.rawMaterialType.name === material.material
          )
          if (selectedMaterial) {
            const usedQty = Number.parseFloat(material.quantity)
            const existing = materialUsageMap.get(material.material)
            
            if (existing) {
              existing.total += usedQty
            } else {
              materialUsageMap.set(material.material, {
                total: usedQty,
                unit: selectedMaterial.rawMaterialType.unit,
                available: selectedMaterial.quantity
              })
            }
          }
        }
      }
    }
    
    // Check if any material exceeds available stock
    materialUsageMap.forEach((usage, materialName) => {
      if (usage.total > usage.available) {
        insufficientMaterials.push(
          `${materialName}: Total usage ${usage.total.toFixed(2)} ${usage.unit} exceeds available stock ${usage.available} ${usage.unit} (Shortage: ${(usage.total - usage.available).toFixed(2)} ${usage.unit})`
        )
      }
    })

    if (insufficientMaterials.length > 0) {
      alert("❌ Insufficient Stock!\n\nYour total material usage across all products exceeds available stock:\n\n" + insufficientMaterials.join("\n"))
      return
    }

    setSubmitting(true)
    try {
      // Record each product separately
      let successCount = 0
      for (const productData of validProducts) {
        const validMaterials = productData.materials.filter((m) => m.material && m.quantity)
        const materialsData = validMaterials.map((m) => ({
          material: m.material,
          quantity: Number.parseFloat(m.quantity),
        }))

        const result = await addProduction({
          product: productData.product,
          quantity: Number.parseFloat(productData.quantity),
          materials: materialsData,
          date: productData.date,
        })

        if (result) successCount++
      }

      if (successCount > 0) {
        setFormData({
          products: [
            { product: "", quantity: "", materials: [{ material: "", quantity: "" }], date: new Date().toISOString().split("T")[0] },
          ],
        })
        setIsModalOpen(false)
        alert(`${successCount} production record(s) created successfully!`)
      } else {
        alert("Failed to record production. Please try again.")
      }
    } catch (err) {
      alert("An error occurred while recording production")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this production record?")) return
    
    const success = await deleteProduction(id)
    if (success) {
      alert("Production record deleted successfully!")
    } else {
      alert("Failed to delete production record")
    }
  }

  const viewDetails = (record: Production) => {
    setSelectedProduction(record)
    setShowDetailsModal(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Production</h1>
          <p className="text-muted-foreground mt-1">Record production with multiple materials used</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg"
        >
          <Plus size={20} />
          Record Production
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Production Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card p-4 md:p-6 border-b flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Record Production</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProduction} className="p-4 md:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-foreground">Products to Record</h3>
              </div>

              {formData.products.map((productItem, productIndex) => (
                <div key={productIndex} className="border border-border rounded-lg p-4 space-y-4 bg-secondary/20">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-foreground">Product #{productIndex + 1}</h4>
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductField(productIndex)}
                        className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <X size={18} />
                        Remove Product
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
                    <select
                      value={productItem.product}
                      onChange={(e) => updateProduct(productIndex, "product", e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
                    >
                      <option value="">Select a product type...</option>
                      {productTypes.map((type) => (
                        <option key={type._id} value={type.name}>
                          {type.name} ({type.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Quantity Made *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={productItem.quantity}
                      onChange={(e) => updateProduct(productIndex, "quantity", e.target.value)}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <h5 className="text-sm font-semibold text-foreground">Materials Used *</h5>
                      <button
                        type="button"
                        onClick={() => addMaterialField(productIndex)}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-xs"
                      >
                        <Plus size={16} />
                        Add Material
                      </button>
                    </div>

                    {productItem.materials.map((material, materialIndex) => {
                      const selectedMaterial = rawMaterials.find(
                        (rm) => rm.rawMaterialType.name === material.material
                      )
                      const originalStock = selectedMaterial ? selectedMaterial.quantity : 0
                      
                      // Calculate total usage of this material in previous products
                      let previousUsage = 0
                      for (let i = 0; i < productIndex; i++) {
                        const prevProduct = formData.products[i]
                        for (const prevMaterial of prevProduct.materials) {
                          if (prevMaterial.material === material.material) {
                            previousUsage += Number.parseFloat(prevMaterial.quantity) || 0
                          }
                        }
                      }
                      
                      // Also add usage from earlier materials in the same product
                      for (let i = 0; i < materialIndex; i++) {
                        if (productItem.materials[i].material === material.material) {
                          previousUsage += Number.parseFloat(productItem.materials[i].quantity) || 0
                        }
                      }
                      
                      const availableQty = originalStock - previousUsage
                      const usedQty = Number.parseFloat(material.quantity) || 0
                      const remainingQty = availableQty - usedQty
                      const isInsufficient = remainingQty < 0
                      
                      return (
                        <div key={materialIndex} className="space-y-1">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <select
                              value={material.material}
                              onChange={(e) => updateMaterial(productIndex, materialIndex, "material", e.target.value)}
                              className="col-span-1 sm:col-span-6 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            >
                              <option value="">Select material...</option>
                              {rawMaterials.map((rm) => (
                                <option key={rm._id} value={rm.rawMaterialType.name}>
                                  {rm.rawMaterialType.name} ({rm.rawMaterialType.unit})
                                </option>
                              ))}
                            </select>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Qty"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(productIndex, materialIndex, "quantity", e.target.value)}
                              className={`col-span-1 sm:col-span-4 text-sm ${isInsufficient ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {productItem.materials.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMaterialField(productIndex, materialIndex)}
                                className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end text-red-600 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          {material.material && (
                            <div className="text-xs pl-1 space-y-0.5">
                              <div className="text-muted-foreground">
                                Current Stock: <span className={`font-semibold ${availableQty < 10 ? 'text-orange-600' : 'text-blue-600'}`}>
                                  {availableQty} {selectedMaterial?.rawMaterialType.unit || ''}
                                </span>
                              </div>
                              {usedQty > 0 && (
                                <div className="text-muted-foreground">
                                  {isInsufficient ? (
                                    <span className="font-semibold text-red-600">
                                      ⚠️ Insufficient! Need {Math.abs(remainingQty).toFixed(2)} {selectedMaterial?.rawMaterialType.unit || ''} more
                                    </span>
                                  ) : (
                                    <>
                                      After Use: <span className={`font-semibold ${availableQty < 10 ? 'text-orange-600' : 'text-blue-600'}`}>
                                        {remainingQty.toFixed(2)} {selectedMaterial?.rawMaterialType.unit || ''} remaining
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Production Date</label>
                    <Input
                      type="date"
                      value={productItem.date}
                      onChange={(e) => updateProduct(productIndex, "date", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    "Record Production"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="sm:flex-1 bg-secondary hover:bg-muted text-foreground"
                >
                  Cancel
                </Button>
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
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Production ID</p>
                  <p className="text-lg md:text-xl font-semibold text-foreground">#{selectedProduction._id.slice(-6)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="text-lg md:text-xl font-semibold text-foreground">{selectedProduction.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg md:text-xl font-semibold text-foreground">{selectedProduction.quantity}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Materials Used</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full min-w-max md:min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-foreground text-xs md:text-sm">
                          Material
                        </th>
                        <th className="text-right py-2 px-3 font-semibold text-foreground text-xs md:text-sm">
                          Qty Used
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduction.materials.map((material, index) => (
                        <tr key={index} className="border-b hover:bg-secondary">
                          <td className="py-2 px-3">
                            <span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {material.material}
                            </span>
                          </td>
                          <td className="text-right py-2 px-3 font-semibold text-xs md:text-sm">{material.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Production History */}
      {!loading && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Production History</h2>
          {productions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No production records found. Start by recording your first production!
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-max md:min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Product</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Qty</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Materials</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productions.map((record) => (
                    <tr key={record._id} className="border-b hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">#{record._id.slice(-6)}</td>
                      <td className="py-3 px-4 text-xs md:text-sm font-medium">{record.product}</td>
                      <td className="py-3 px-4 text-xs md:text-sm font-semibold">{record.quantity}</td>
                      <td className="py-3 px-4 text-xs md:text-sm">{record.materials.length} material(s)</td>
                      <td className="py-3 px-4 text-xs md:text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-xs md:text-sm">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => viewDetails(record)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors whitespace-nowrap"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
  )
}
