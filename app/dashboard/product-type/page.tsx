"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

interface ProductTypeItem {
  id: string
  name: string
  unit: string
  description: string
}

export default function ProductTypePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [description, setDescription] = useState("")

  const [items, setItems] = useState<ProductTypeItem[]>([
    { id: "1", name: "Detergent Powder", unit: "Kg", description: "Household washing powder" },
    { id: "2", name: "Fabric Softener", unit: "L", description: "Liquid softener for fabrics" },
    { id: "3", name: "Packaging Sleeve", unit: "cm", description: "Printed sleeve for 500g pack" },
  ])

  const resetForm = () => {
    setName("")
    setUnit("")
    setDescription("")
    setEditingId(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId ? { ...it, name: name.trim(), unit: unit.trim(), description: description.trim() } : it
        )
      )
    } else {
      const newItem: ProductTypeItem = {
        id: String(Date.now()),
        name: name.trim(),
        unit: unit.trim(),
        description: description.trim(),
      }
      setItems((prev) => [newItem, ...prev])
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const handleOpenEdit = (item: ProductTypeItem) => {
    setEditingId(item.id)
    setName(item.name)
    setUnit(item.unit)
    setDescription(item.description)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Product Types</h1>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus size={18} />
          Add Product Type
        </Button>
      </div>

      {/* Add/Edit Modal */}
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={editingId ? "Edit Product Type" : "Add New Product Type"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Product Name *</label>
            <Input placeholder="e.g., Detergent Powder" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Unit</label>
            <Input
              placeholder="e.g., Kg, cm, L"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <Input
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                resetForm()
              }}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingId ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </ModalOverlay>

      {/* List */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Product Type List</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Product Name</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Unit</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Description</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b hover:bg-secondary/50">
                  <td className="py-3 px-4 text-xs md:text-sm">{it.name}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{it.unit}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{it.description}</td>
                  <td className="py-3 px-4 space-x-5">
                    <button
                      onClick={() => handleDelete(it.id)}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => handleOpenEdit(it)} className="inline-flex items-center gap-1">
                      <Edit size={16} />
                    </button>
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
