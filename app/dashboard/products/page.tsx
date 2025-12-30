"use client"

import { useLanguage } from "@/lib/auth-context"
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
  const { language } = useLanguage();
  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        products: "නිෂ්පාදන",
        addProduct: "නිෂ්පාදනය එක් කරන්න",
        currentInventory: "වත්මන් තොගය",
        productHistory: "නිෂ්පාදන ඉතිහාසය",
        productsInventory: "නිෂ්පාදන තොගය",
        productName: "නිෂ්පාදන නම",
        quantity: "ප්‍රමාණය",
        actions: "ක්‍රියාමාර්ග",
        adjustInventory: "තොගය සකසන්න",
        currentQuantity: "වත්මන් ප්‍රමාණය:",
        adjustAmount: "ප්‍රමාණය වෙනස් කරන්න (+ එකතු / - ඉවත්)",
        applyChange: "වෙනස යොදන්න",
        deletePurchase: "මිලදී ගැනීම මකන්න",
        deleteHistoryOnly: "ඉතිහාසය පමණක් මකන්න",
        doYouWantToDeduct: "ඔබට තොගයද අඩු කිරීමට අවශ්‍යද, නැතහොත් ඉතිහාසය පමණක් මකන්නද?",
        product: "නිෂ්පාදනය",
        qty: "ප්‍රමාණය",
        date: "දිනය",
        cancel: "අවලංගු කරන්න",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      products: "Products",
      addProduct: "Add Product",
      currentInventory: "Current Inventory",
      productHistory: "Product History",
      productsInventory: "Products Inventory",
      productName: "Product Name",
      quantity: "Quantity",
      actions: "Actions",
      adjustInventory: "Adjust Inventory",
      currentQuantity: "Current Quantity:",
      adjustAmount: "Adjust Amount (+ add / - remove)",
      applyChange: "Apply Change",
      deletePurchase: "Delete Purchase",
      deleteHistoryOnly: "Delete History Only",
      doYouWantToDeduct: "Do you want to deduct stock as well, or delete only the purchase history?",
      product: "Product",
      qty: "Qty",
      date: "Date",
      cancel: "Cancel",
    };
    return en[key] || key;
  };
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
  const { histories, fetchHistories, deleteHistory } = useProductHistory()

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
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">{t("products")}</h1>
        <Link
          href="/dashboard/production" 
          className="inline-flex items-center w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 justify-center py-2 px-4 rounded"
        >
          <Plus size={20} />
          {t("addProduct")}
        </Link>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === "inventory" ? "text-primary border-b-2 border-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {t("currentInventory")}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 md:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "history" ? "text-primary border-b-2 border-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <History size={16} />
          {t("productHistory")}
        </button>
      </div>

      {/* Edit Inventory Modal */}
      <ModalOverlay
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("adjustInventory")}
      >
        <form onSubmit={handleApplyInventoryChange} className="space-y-4">
          <div className="text-sm">
            {t("currentQuantity")}
            <span className="font-semibold ml-2">{editState?.currentQty}</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("adjustAmount")}</label>
            <Input
              type="number"
              placeholder={language === "sinhala" ? "+10 හෝ -5" : "+10 or -5"}
              value={editState?.changeQty || ""}
              onChange={(e) => editState && setEditState({ ...editState, changeQty: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-secondary">
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-primary">
              {t("applyChange")}
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
        title={t("deletePurchase")}
      >
        <p className="text-sm text-muted-foreground mb-4">
          {t("doYouWantToDeduct")}
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            onClick={async () => {
              if (!deletePurchaseId) return
              await deleteHistory(deletePurchaseId)
              // setIsDeleteModalOpen(false)
            }}
          >
            {t("deleteHistoryOnly")}
          </Button>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            {t("cancel")}
          </Button>
        </div>
      </ModalOverlay>

      {activeTab === "inventory" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">{t("productsInventory")}</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("productName")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("quantity")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm">{product.typeId.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm font-semibold">{product.quantity}</td>
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
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">{t("productHistory")}</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("product")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("qty")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("date")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {histories.map((entry) => (
                  <tr key={entry._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm font-medium">{entry.type.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.quantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">  {new Date(entry.date).toISOString().split("T")[0]}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">
                      <button
                        onClick={() => {
                          setDeletePurchaseId(entry._id)
                          setIsDeleteModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
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
    </div>
  )
}
