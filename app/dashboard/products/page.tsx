"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, History, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"
import Link from "next/link"

import { useProducts } from "@/lib/product-context"
import { useProductHistory } from "@/lib/product-history"

type Product = {
  _id: string
  name: string
  quantity: number
  cost: number
  typeId: {
    _id: string
  }
}

type ProductPurchase = {
  id: string
  productId: string
  name: string
  quantity: number
  costPerUnit: number
  cost: number
  date: string
}

const today = new Date().toISOString().split("T")[0]

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory")

  // const [products, setProducts] = useState<Product[]>(initialProducts)
  const [purchases, setPurchases] = useState<ProductPurchase[]>()

  // const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // const [formData, setFormData] = useState({ name: "", costPerUnit: "", initialStock: "", date: today })
  const [editState, setEditState] = useState<{ id: string; currentQty: number; changeQty: string } | null>(null)
  const [deletePurchaseId, setDeletePurchaseId] = useState<string | null>(null)

  const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
  const { histories, fetchHistories } = useProductHistory()

  // const findProductByName = (name: string) => products.find((p) => p.name === name)

  useEffect(() => {
    fetchProducts()
    fetchHistories()
  }, [])

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id)
  }


  const handleOpenEdit = (product: Product) => {
    setEditState({ id: product._id, currentQty: product.quantity, changeQty: "" })
    setIsEditModalOpen(true)
  }


  const handleApplyInventoryChange = async (e: React.FormEvent) => {
    console.log("update button clicked", editState)

    e.preventDefault()
    if (!editState) return
    const delta = Number(editState.changeQty)
    if (!delta) return

    const product = products.find((p) => p._id === editState.id)
    console.log("update product :", product)
    if (!product) return

  await updateProduct(editState.id, { quantity: product.quantity + delta })

    setIsEditModalOpen(false)
    setEditState(null)
  }

  // const handleDeleteAndDeduct = async (id: string) => {
  //   const entry = purchases.find((e) => e.id === id)
  //   if (!entry) return
  //   setPurchases((prev) => prev.filter((e) => e.id !== id))
  //   setProducts((prev) =>
  //     prev.map((p) => (p.id === entry.productId ? { ...p, stock: Math.max(0, p.stock - entry.quantity) } : p))
  //   )
  // }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Products</h1>
        <Link
          href="/dashboard/production" 
          className="inline-flex items-center w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 justify-center py-2 px-4 rounded"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === "inventory" ? "text-primary border-b-2 border-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Current Inventory
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "history" ? "text-primary border-b-2 border-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <History size={16} />
          Product History
        </button>
      </div>

      {/* Edit Inventory Modal */}
      <ModalOverlay
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Adjust Inventory"
      >
        <form onSubmit={handleApplyInventoryChange} className="space-y-4">
          <div className="text-sm">
            Current Quantity:
            <span className="font-semibold ml-2">{editState?.currentQty}</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Adjust Amount (+ add / - remove)</label>
            <Input
              type="number"
              placeholder="+10 or -5"
              value={editState?.changeQty || ""}
              onChange={(e) => editState && setEditState({ ...editState, changeQty: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-secondary">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary">
              Apply Change
            </Button>
          </div>
        </form>
      </ModalOverlay>

      {/* Delete Purchase Modal */}
      <ModalOverlay
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletePurchaseId(null)
        }}
        title="Delete Purchase"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Do you want to deduct stock as well, or delete only the purchase history?
        </p>
        <div className="flex flex-col gap-3">
          {/* <Button
            variant="destructive"
            onClick={async () => {
              if (!deletePurchaseId) return
              await handleDeleteHistoryOnly(deletePurchaseId)
              setIsDeleteModalOpen(false)
            }}
          >
            Delete History Only
          </Button> */}
          {/* <Button
            onClick={async () => {
              if (!deletePurchaseId) return
              await handleDeleteAndDeduct(deletePurchaseId)
              setIsDeleteModalOpen(false)
            }}
          >
            Delete & Deduct Stock
          </Button> */}
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </ModalOverlay>

      {activeTab === "inventory" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Products Inventory</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Product Name</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Quantity</th>
                  {/* <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Cost</th> */}
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm">{product.typeId.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm font-semibold">{product.quantity}</td>
                    {/* <td className="py-3 px-4 text-xs md:text-sm">$</td> */}
                    <td className="py-3 px-4 text-xs md:text-sm space-x-3">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit size={16} />
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
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Product History</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Product</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Qty</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Cost/Unit</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {purchases.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm font-medium">{entry.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.quantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">${entry.costPerUnit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">${entry.cost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.date}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">
                      <button
                        onClick={() => {
                          setDeletePurchaseId(entry.id)
                          setIsDeleteModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
