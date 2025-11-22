"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

const initialProducts = [
  { id: 1, name: "Bread", stock: 45, costPerUnit: 3.5 },
  { id: 2, name: "Cake", stock: 12, costPerUnit: 8.0 },
  { id: 3, name: "Cookies", stock: 120, costPerUnit: 2.0 },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", costPerUnit: "", initialStock: "" })

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.costPerUnit && formData.initialStock) {
      const newProduct = {
        id: products.length + 1,
        name: formData.name,
        costPerUnit: Number.parseFloat(formData.costPerUnit),
        stock: Number.parseFloat(formData.initialStock),
      }
      setProducts([...products, newProduct])
      setFormData({ name: "", costPerUnit: "", initialStock: "" })
      setIsModalOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Products</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: "", costPerUnit: "", initialStock: "" })
        }}
        title="Add New Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
            <Input
              placeholder="Product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
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
            <label className="block text-sm font-medium text-foreground mb-2">Initial Stock *</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.initialStock}
              onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: "", costPerUnit: "", initialStock: "" })
              }}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Product
            </Button>
          </div>
        </form>
      </ModalOverlay>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Products List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Product Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Cost Per Unit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-sm">{product.name}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{product.stock}</td>
                  <td className="py-3 px-4 text-sm">${product.costPerUnit.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleDelete(product.id)}
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
