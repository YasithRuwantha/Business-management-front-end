"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, History, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

import { useRawMaterials } from "@/lib/raw-material-context"
import { useRawMaterialTypes } from "@/lib/raw-material-type-context"
import { useRawMaterialPurchases } from "@/lib/raw-material-purchase"

const today = new Date().toISOString().split("T")[0];


export default function RawMaterialsPage() {
  const { language } = useLanguage();

  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        rawMaterials: "අමුද්‍රව්‍ය",
        addMaterial: "අමුද්‍රව්‍ය එක් කරන්න",
        addNewRawMaterial: "නව අමුද්‍රව්‍යයක් එක් කරන්න",
        materialName: "ද්‍රව්‍යයේ නම",
        selectType: "වර්ගය තෝරන්න",
        quantity: "ප්‍රමාණය",
        unit: "ඒකකය",
        cost: "වියදම",
        date: "දිනය",
        cancel: "අවලංගු කරන්න",
        add: "එක් කරන්න",
        currentInventory: "වත්මන් තොගය",
        purchaseHistory: "මිලදී ගැනීම් ඉතිහාසය",
        materialsInventory: "අමුද්‍රව්‍ය තොගය",
        actions: "ක්‍රියාමාර්ග",
        name: "නම",
        qty: "ප්‍රමාණය",
        adjustInventory: "තොගය සකසන්න",
        currentQuantity: "වත්මන් ප්‍රමාණය:",
        adjustAmount: "ප්‍රමාණය වෙනස් කරන්න (+ එකතු / - ඉවත්)",
        applyChange: "වෙනස යොදන්න",
        deletePurchase: "මිලදී ගැනීම මකන්න",
        deleteHistoryOnly: "ඉතිහාසය පමණක් මකන්න",
        deleteAndDeduct: "මකන්න සහ තොගය අඩු කරන්න",
        doYouWantToDeduct: "ඔබට තොගයද අඩු කිරීමට අවශ්‍යද, නැතහොත් ඉතිහාසය පමණක් මකන්නද?",
        purchaseHistoryTitle: "මිලදී ගැනීම් ඉතිහාසය",
        material: "ද්‍රව්‍යය",
        total: "මුළු වියදම",
        loading: "පූරණය වෙමින්...",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      rawMaterials: "Raw Materials",
      addMaterial: "Add Material",
      addNewRawMaterial: "Add New Raw Material",
      materialName: "Material Name *",
      selectType: "Select type",
      quantity: "Quantity *",
      unit: "Unit",
      cost: "Cost ",
      date: "Date ",
      cancel: "Cancel",
      add: "Add Material",
      currentInventory: "Current Inventory",
      purchaseHistory: "Purchase History",
      materialsInventory: "Materials Inventory",
      actions: "Actions",
      name: "Name",
      qty: "Qty",
      adjustInventory: "Adjust Inventory",
      currentQuantity: "Current Quantity:",
      adjustAmount: "Adjust Amount (+ add / - remove)",
      applyChange: "Apply Change",
      deletePurchase: "Delete Purchase",
      deleteHistoryOnly: "Delete History Only",
      deleteAndDeduct: "Delete & Deduct Stock",
      doYouWantToDeduct: "Do you want to deduct stock as well, or delete only the purchase history?",
      purchaseHistoryTitle: "Purchase History",
      material: "Material",
      total: "Total",
      loading: "Loading materials...",
    };
    return en[key] || key;
  };
  const [activeTab, setActiveTab] = useState("inventory")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", quantity: "", unit: "", cost: "", date: today })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editMaterial, setEditMaterial] = useState<any>(null)
  const [deletePurchaseId, setDeletePurchaseId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)



  const { materials, addMaterial, loading, fetchRawMaterials, updateMaterial } = useRawMaterials()
  const { types } = useRawMaterialTypes()
  const { purchases, deletePurchase, fetchPurchases, deletePurchaseWithStock } = useRawMaterialPurchases()
 
  useEffect(()=> {
    fetchRawMaterials();
  }, [])


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

    setFormData({ name: "", quantity: "", unit: "", cost: "", date: today })
    setIsModalOpen(false)
  }

  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()

    const delta = Number(editMaterial.changeQty)
    if (!delta) return

    const newQty = editMaterial.currentQty + delta
    if (newQty < 0) {
      alert("Quantity cannot be negative")
      return
    }

    await updateMaterial(editMaterial.id, {
      quantity: newQty
    })

    setIsEditModalOpen(false)
    fetchRawMaterials()
  }



  const handleDelete = async (id: string) => {
    // await removeMaterial(id)
  }

  const handleDeletePurchase = async (id: string) => {
    await deletePurchase(id)
  }

  const handleEditOpen = (material: any) => {
    setEditMaterial({
      id: material._id,
      currentQty: material.quantity,
      changeQty: ""
    })
    setIsEditModalOpen(true)
  }



  useEffect(() => {
    if (activeTab === "inventory") {
      fetchRawMaterials()
    }
    if (activeTab === "history") {
      fetchPurchases()
    }
  }, [activeTab])


  if (loading) return <p className="p-6 text-lg">{t("loading")}</p>

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">{t("rawMaterials")}</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          {t("addMaterial")}
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
          {t("currentInventory")}
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
          {t("purchaseHistory")}
        </button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: "", quantity: "", unit: "", cost: "", date: "" })
        }}
        title={t("addNewRawMaterial")}
      >
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("materialName")}</label>
            <Input
              placeholder={t("selectType")}
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
              <label className="block text-sm font-medium text-foreground mb-2">{t("quantity")}</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("unit")}</label>
              <Input value={types.find((t) => t.name === formData.name)?.unit || ""} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("cost")}</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("date")}</label>
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
              {t("cancel")}
            </Button>
            <Button type="submit" className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {t("addMaterial")}
            </Button>
          </div>
        </form>
      </ModalOverlay>

      <ModalOverlay
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("adjustInventory")}
      >
        <form onSubmit={handleUpdateMaterial} className="space-y-4">
          <div className="text-sm">
            {t("currentQuantity")}
            <span className="font-semibold ml-2">
              {editMaterial?.currentQty}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("adjustAmount")}
            </label>
            <Input
              type="number"
              placeholder={language === "sinhala" ? "+10 හෝ -5" : "+10 or -5"}
              value={editMaterial?.changeQty || ""}
              onChange={(e) =>
                setEditMaterial({ ...editMaterial, changeQty: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-secondary"
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-primary">
              {t("applyChange")}
            </Button>
          </div>
        </form>
      </ModalOverlay>

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
              await deletePurchase(deletePurchaseId)
              setIsDeleteModalOpen(false)
            }}
          >
            {t("deleteHistoryOnly")}
          </Button>
          <Button
            onClick={async () => {
              if (!deletePurchaseId) return
              await deletePurchaseWithStock(deletePurchaseId)
              setIsDeleteModalOpen(false)
            }}
          >
            {t("deleteAndDeduct")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            {t("cancel")}
          </Button>
        </div>
      </ModalOverlay>




      {activeTab === "inventory" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">{t("materialsInventory")}</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("name")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("qty")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("unit")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm">{material.rawMaterialType.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{material.quantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{material.rawMaterialType.unit}</td>
                    <td className="py-3 px-4 text-xs md:text-sm space-x-3">
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                          onClick={() => handleEditOpen(material)}
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
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">{t("purchaseHistoryTitle")}</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("material")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("qty")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("unit")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("total")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("date")}</th>
                  <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((entry) => (
                  <tr key={entry._id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-xs md:text-sm font-medium">{entry.typeId.name}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.purchaseQuantity}</td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.typeId.unit}</td>
                    <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">
                      ${entry.cost}
                    </td>
                    <td className="py-3 px-4 text-xs md:text-sm">{entry.purchaseDate}</td>
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
