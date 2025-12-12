"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, History } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

import { useRawMaterials } from "@/lib/raw-material-context"
import { useRawMaterialTypes } from "@/lib/raw-material-type-context"
import { useRawMaterialPurchases } from "@/lib/raw-material-purchase"

const today = new Date().toISOString().split("T")[0];


export default function RawMaterialsPage() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", quantity: "", unit: "", cost: "", date: today })

  const { materials, addMaterial, loading } = useRawMaterials()
  const { types } = useRawMaterialTypes()
  const { purchases } = useRawMaterialPurchases()
 
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedType = types.find((t) => t.name === formData.name)
    if (!selectedType) return

    await addMaterial({
      name: formData.name,
      quantity: Number(formData.quantity),
      unit: selectedType.unit,
      costPerUnit: selectedType.unitCost,
      cost: formData.cost,
      date: formData.date
    })

    setFormData({ name: "", quantity: "", unit: "", cost: "", date: "" })
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await removeMaterial(id)
  }

  if (loading) return <p className="p-6 text-lg">Loading materials...</p>

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Raw Materials</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          Add Material
        </Button>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === "inventory"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Current Inventory
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <History size={16} />
          Purchase History
        </button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: "", quantity: "", unit: "", cost: "", date: "" })
        }}
        title="Add New Raw Material"
      >
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Material Name *</label>
            <Input
              placeholder="Select type"
              list="material-types"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
            <datalist id="material-types">
              {types.map((t) => (
                <option key={t._id} value={t.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
              <Input value={types.find((t) => t.name === formData.name)?.unit || ""} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cost </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: "", quantity: "", unit: "", cost: "", date: "" })
              }}
              className="sm:flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Material
            </Button>
          </div>
        </form>
      </ModalOverlay>

      {activeTab === "inventory" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Materials Inventory</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Qty</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Unit</th>
                  {/* <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Cost/Unit</th> */}
                  {/* <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Total</th> */}
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm">{material.rawMaterialType.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{material.quantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{material.rawMaterialType.unit}</td>
                    {/* <td className="py-3 px-4 text-xs md:text-sm">${material.costPerUnit}</td> */}
                    {/* <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">
                      ${(material.quantity * material.costPerUnit).toFixed(2)}
                    </td> */}
                    <td className="py-3 px-4 text-xs md:text-sm">
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "history" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Purchase History</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Material</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Qty</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Unit</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Cost/Unit</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((entry) => (
                  <tr key={entry._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm font-medium">{entry.typeId.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.purchaseQuantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.typeId.unit}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">$</td>
                    <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">
                      ${entry.cost}
                    </td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.purchaseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
