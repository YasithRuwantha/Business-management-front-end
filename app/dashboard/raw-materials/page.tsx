"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, History } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

const initialMaterials = [
  { id: 1, name: "Flour", quantity: 100, unit: "kg", costPerUnit: 2.5 },
  { id: 2, name: "Sugar", quantity: 50, unit: "kg", costPerUnit: 1.8 },
  { id: 3, name: "Butter", quantity: 30, unit: "kg", costPerUnit: 6.5 },
  { id: 4, name: "Eggs", quantity: 500, unit: "pieces", costPerUnit: 0.3 },
]

const initialPurchaseHistory = [
  {
    id: 1,
    materialId: 1,
    material: "Flour",
    quantity: 50,
    unit: "kg",
    costPerUnit: 2.5,
    totalCost: 125,
    date: "2024-11-20",
    supplier: "Quality Mills",
  },
  {
    id: 2,
    materialId: 2,
    material: "Sugar",
    quantity: 30,
    unit: "kg",
    costPerUnit: 1.8,
    totalCost: 54,
    date: "2024-11-18",
    supplier: "Sweet Suppliers",
  },
  {
    id: 3,
    materialId: 1,
    material: "Flour",
    quantity: 50,
    unit: "kg",
    costPerUnit: 2.5,
    totalCost: 125,
    date: "2024-11-15",
    supplier: "Quality Mills",
  },
  {
    id: 4,
    materialId: 3,
    material: "Butter",
    quantity: 20,
    unit: "kg",
    costPerUnit: 6.5,
    totalCost: 130,
    date: "2024-11-10",
    supplier: "Dairy Fresh",
  },
]

export default function RawMaterialsPage() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [materials, setMaterials] = useState(initialMaterials)
  const [purchaseHistory, setPurchaseHistory] = useState(initialPurchaseHistory)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", quantity: "", unit: "", costPerUnit: "", supplier: "" })

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.quantity && formData.unit && formData.costPerUnit) {
      const newMaterial = {
        id: materials.length + 1,
        name: formData.name,
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        costPerUnit: Number.parseFloat(formData.costPerUnit),
      }
      setMaterials([...materials, newMaterial])

      const historyEntry = {
        id: purchaseHistory.length + 1,
        materialId: newMaterial.id,
        material: formData.name,
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        costPerUnit: Number.parseFloat(formData.costPerUnit),
        totalCost: Number.parseFloat(formData.quantity) * Number.parseFloat(formData.costPerUnit),
        date: new Date().toISOString().split("T")[0],
        supplier: formData.supplier || "Direct Purchase",
      }
      setPurchaseHistory([...purchaseHistory, historyEntry])

      setFormData({ name: "", quantity: "", unit: "", costPerUnit: "", supplier: "" })
      setIsModalOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Raw Materials</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          Add Material
        </Button>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "inventory"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Current Inventory
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
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
          setFormData({ name: "", quantity: "", unit: "", costPerUnit: "", supplier: "" })
        }}
        title="Add New Raw Material"
      >
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Material Name *</label>
            <Input
              placeholder="Material name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-sm font-medium text-foreground mb-2">Unit *</label>
              <Input
                placeholder="kg, L, etc."
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cost Per Unit *</label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Supplier</label>
            <Input
              placeholder="Supplier name (optional)"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: "", quantity: "", unit: "", costPerUnit: "", supplier: "" })
              }}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Material
            </Button>
          </div>
        </form>
      </ModalOverlay>

      {activeTab === "inventory" && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Materials Inventory</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Cost Per Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{material.name}</td>
                    <td className="py-3 px-4 text-sm">{material.quantity}</td>
                    <td className="py-3 px-4 text-sm">{material.unit}</td>
                    <td className="py-3 px-4 text-sm">${material.costPerUnit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-primary">
                      ${(material.quantity * material.costPerUnit).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleDelete(material.id)}
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
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Purchase History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Material</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Cost Per Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{entry.material}</td>
                    <td className="py-3 px-4 text-sm">{entry.quantity}</td>
                    <td className="py-3 px-4 text-sm">{entry.unit}</td>
                    <td className="py-3 px-4 text-sm">${entry.costPerUnit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-primary">${entry.totalCost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-foreground/70">{entry.supplier}</td>
                    <td className="py-3 px-4 text-sm">{entry.date}</td>
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
