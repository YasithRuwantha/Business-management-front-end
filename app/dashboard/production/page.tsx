"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, X, Plus } from "lucide-react"

interface MaterialItem {
  material: string
  quantity: string
}

interface ProductionRecord {
  id: number
  product: string
  quantity: number
  materials: MaterialItem[]
  date: string
}

const initialProduction: ProductionRecord[] = [
  {
    id: 1,
    product: "Bread",
    quantity: 50,
    materials: [
      { material: "Flour", quantity: "25" },
      { material: "Water", quantity: "10" },
    ],
    date: "2024-11-20",
  },
  {
    id: 2,
    product: "Cake",
    quantity: 10,
    materials: [
      { material: "Butter", quantity: "5" },
      { material: "Eggs", quantity: "20" },
    ],
    date: "2024-11-20",
  },
]

const materialOptions = [
  { id: 1, name: "Flour" },
  { id: 2, name: "Sugar" },
  { id: 3, name: "Butter" },
  { id: 4, name: "Eggs" },
  { id: 5, name: "Water" },
]

export default function ProductionPage() {
  const [production, setProduction] = useState<ProductionRecord[]>(initialProduction)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState<ProductionRecord | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    materials: [{ material: "", quantity: "" }],
    date: new Date().toISOString().split("T")[0],
  })

  const addMaterialField = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { material: "", quantity: "" }],
    })
  }

  const removeMaterialField = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    })
  }

  const updateMaterial = (index: number, field: string, value: string) => {
    const newMaterials = [...formData.materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setFormData({ ...formData, materials: newMaterials })
  }

  const handleAddProduction = (e: React.FormEvent) => {
    e.preventDefault()

    const validMaterials = formData.materials.filter((m) => m.material && m.quantity)

    if (!formData.product || !formData.quantity || validMaterials.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const newRecord: ProductionRecord = {
      id: production.length + 1,
      product: formData.product,
      quantity: Number.parseFloat(formData.quantity),
      materials: validMaterials,
      date: formData.date,
    }
    setProduction([...production, newRecord])
    setFormData({
      product: "",
      quantity: "",
      materials: [{ material: "", quantity: "" }],
      date: new Date().toISOString().split("T")[0],
    })
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setProduction(production.filter((p) => p.id !== id))
  }

  const viewDetails = (record: ProductionRecord) => {
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg"
        >
          <Plus size={20} />
          Record Production
        </Button>
      </div>

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
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
                <Input
                  placeholder="Product name"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="text-base"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Quantity Made *</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="text-base"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">Materials Used</h3>
                  <button
                    type="button"
                    onClick={addMaterialField}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    <Plus size={20} />
                    Add Material
                  </button>
                </div>

                {formData.materials.map((material, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pb-4 border-b">
                    <select
                      value={material.material}
                      onChange={(e) => updateMaterial(index, "material", e.target.value)}
                      className="col-span-1 sm:col-span-7 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    >
                      <option value="">Select a material...</option>
                      {materialOptions.map((mat) => (
                        <option key={mat.id} value={mat.name}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Qty used"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                      className="col-span-1 sm:col-span-3 text-sm"
                    />
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterialField(index)}
                        className="col-span-1 sm:col-span-2 flex justify-center sm:justify-end text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Record Production
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <p className="text-lg md:text-xl font-semibold text-foreground">#{selectedProduction.id}</p>
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
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Production History</h2>
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
              {production.map((record) => (
                <tr key={record.id} className="border-b hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">#{record.id}</td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium">{record.product}</td>
                  <td className="py-3 px-4 text-xs md:text-sm font-semibold">{record.quantity}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{record.materials.length} material(s)</td>
                  <td className="py-3 px-4 text-xs md:text-sm text-muted-foreground">{record.date}</td>
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
                        onClick={() => handleDelete(record.id)}
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
      </Card>
    </div>
  )
}
