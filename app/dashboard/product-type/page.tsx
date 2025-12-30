"use client"

import { useLanguage } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"
import { useProductTypes } from "@/lib/product-type-context"

export default function ProductTypePage() {
  const { language } = useLanguage();
  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        productTypes: "නිෂ්පාදන වර්ග",
        addProductType: "නිෂ්පාදන වර්ගය එක් කරන්න",
        addNewProductType: "නව නිෂ්පාදන වර්ගයක් එක් කරන්න",
        editProductType: "නිෂ්පාදන වර්ගය සංස්කරණය කරන්න",
        productName: "නිෂ්පාදන නම",
        productNameRequired: "නිෂ්පාදන නම *",
        unit: "ඒකකය",
        description: "විස්තරය",
        cancel: "අවලංගු කරන්න",
        add: "එක් කරන්න",
        save: "සුරකින්න",
        productTypeList: "නිෂ්පාදන වර්ග ලැයිස්තුව",
        actions: "ක්‍රියාමාර්ග",
        noProductTypes: "තවමත් නිෂ්පාදන වර්ග නැත.",
        loading: "පූරණය වෙමින්...",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      productTypes: "Product Types",
      addProductType: "Add Product Type",
      addNewProductType: "Add New Product Type",
      editProductType: "Edit Product Type",
      productName: "Product Name *",
      productNameRequired: "Product Name *",
      unit: "Unit",
      description: "Description",
      cancel: "Cancel",
      add: "Add",
      save: "Save",
      productTypeList: "Product Type List",
      actions: "Actions",
      noProductTypes: "No product types yet.",
      loading: "Loading...",
    };
    return en[key] || key;
  };
  const { types, loading, error, createType, updateType, deleteType, fetchTypes } = useProductTypes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchTypes()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      await updateType(editingId, { name: name.trim(), unit: unit.trim(), description: description.trim() })
    } else {
      await createType({ name: name.trim(), unit: unit.trim(), description: description.trim() })
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteType(id)
  }

  const handleOpenEdit = (item: any) => {
    setEditingId(item._id)
    setName(item.name || "")
    setUnit(item.unit || "")
    setDescription(item.description || "")
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">{t("productTypes")}</h1>
        <Button onClick={openAddModal} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus size={18} />
          {t("addProductType")}
        </Button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={editingId ? t("editProductType") : t("addNewProductType")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t("productNameRequired")}</label>
            <Input placeholder={language === "sinhala" ? "නිෂ්පාදන නම ඇතුළත් කරන්න" : "Enter your Product name"} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t("unit")}</label>
            <Input
              placeholder={language === "sinhala" ? "උදා: කි.ග්‍රෑ., සෙ.මී., ලීටර්" : "e.g., Kg, cm, L"}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t("description")}</label>
            <Input
              placeholder={language === "sinhala" ? "කෙටි විස්තරයක් (විකල්ප)" : "Short description (optional)"}
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
              {t("cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingId ? t("save") : t("add")}
            </Button>
          </div>
        </form>
      </ModalOverlay>

      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">{t("productTypeList")}</h2>

        {loading && <p className="text-sm">{t("loading")}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("productName")}</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("unit")}</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("description")}</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {types.map((it: any) => (
                <tr key={it._id} className="border-b hover:bg-secondary/50">
                  <td className="py-3 px-4 text-xs md:text-sm">{it.name}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{it.unit}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{it.description}</td>
                  <td className="py-3 px-4 space-x-5">
                    <button
                      onClick={() => handleDelete(it._id)}
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
              {!loading && types.length === 0 && (
                <tr>
                  <td className="py-3 px-4 text-xs md:text-sm" colSpan={4}>{t("noProductTypes")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
