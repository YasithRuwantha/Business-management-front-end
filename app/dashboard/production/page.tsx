"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

const initialProduction = [
  { id: 1, product: "Bread", quantity: 50, date: "2024-11-20" },
  { id: 2, product: "Cake", quantity: 10, date: "2024-11-20" },
]

export default function ProductionPage() {
  const [production, setProduction] = useState(initialProduction)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleAddProduction = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.product && formData.quantity) {
      const newRecord = {
        id: production.length + 1,
        product: formData.product,
        quantity: Number.parseFloat(formData.quantity),
        date: formData.date,
      }
      setProduction([...production, newRecord])
      setFormData({ product: "", quantity: "", date: new Date().toISOString().split("T")[0] })
      setIsModalOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setProduction(production.filter((p) => p.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Production</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          Record Production
        </Button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ product: "", quantity: "", date: new Date().toISOString().split("T")[0] })
        }}
        title="Record Production"
      >
        <form onSubmit={handleAddProduction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
            <Input
              placeholder="Product name"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quantity Made *</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ product: "", quantity: "", date: new Date().toISOString().split("T")[0] })
              }}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Record Production
            </Button>
          </div>
        </form>
      </ModalOverlay>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Production History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {production.map((record) => (
                <tr key={record.id} className="border-b hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-sm">{record.product}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{record.quantity}</td>
                  <td className="py-3 px-4 text-sm">{record.date}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleDelete(record.id)}
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
    </div>
  )
}
