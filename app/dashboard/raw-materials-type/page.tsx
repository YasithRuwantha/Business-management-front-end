"use client"

import { useLanguage } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"
import { useRawMaterialTypes } from "@/lib/raw-material-type-context"


export default function RawMaterialTypesPage() {
    const { language } = useLanguage();
    // Hardcoded translations for Sinhala
    const t = (key: string) => {
        if (language === "sinhala") {
            const si: Record<string, string> = {
                rawMaterialTypes: "අමුද්‍රව්‍ය වර්ග",
                addType: "වර්ගය එක් කරන්න",
                addNewMaterialType: "නව අමුද්‍රව්‍ය වර්ගයක් එක් කරන්න",
                typeName: "වර්ගයේ නම",
                typeNameRequired: "වර්ගයේ නම *",
                unit: "ඒකකය",
                cost: "වියදම",
                cancel: "අවලංගු කරන්න",
                add: "එක් කරන්න",
                materialTypeList: "අමුද්‍රව්‍ය වර්ග ලැයිස්තුව",
                actions: "ක්‍රියාමාර්ග",
                unitCost: "ඒකකය / වියදම",
            };
            return si[key] || key;
        }
        // English fallback
        const en: Record<string, string> = {
            rawMaterialTypes: "Raw Material Types",
            addType: "Add Type",
            addNewMaterialType: "Add New Material Type",
            typeName: "Type Name *",
            typeNameRequired: "Type Name *",
            unit: "Unit",
            cost: "Cost",
            cancel: "Cancel",
            add: "Add",
            materialTypeList: "Material Type List",
            actions: "Actions",
            unitCost: "Unit / Cost",
        };
        return en[key] || key;
    };
    const { types, createType, deleteType, updateType, fetchTypes } = useRawMaterialTypes();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [typeName, setTypeName] = useState("")
    const [typeUnit, setTypeUnit] = useState("")
    const [typeUnitCost, setTypeUnitCost] = useState("")
    const [editingTypeId, setEditingTypeId] = useState<string | null>(null);

    useEffect(()=> {
        fetchTypes();
    }, [])

    const handleSubmitType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!typeName.trim()) return;

        const typeData = {
            name: typeName.trim(),
            unit: typeUnit,
            unitCost: Number(typeUnitCost),
        };

        if (editingTypeId) {
            // Update existing type
            await updateType(editingTypeId, typeData);
        } else {
            // Create new type
            await createType(typeData);
        }

        // Reset form
        setTypeName("");
        setTypeUnit("");
        setTypeUnitCost("");
        setEditingTypeId(null);
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (type: any) => {
        setEditingTypeId(type._id);
        setTypeName(type.name);
        setTypeUnit(type.unit);
        setTypeUnitCost(String(type.unitCost));
        setIsModalOpen(true);
    };


    const handleDeleteType = async (id: string) => {
        await deleteType(id);
    };

    const handleUpdateType = async (id: string) => {

    }

    return (
        <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">{t("rawMaterialTypes")}</h1>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                    <Plus size={18} />
                    {t("addType")}
                </Button>
            </div>

            {/* Add Type Modal */}
            <ModalOverlay
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t("addNewMaterialType")}
            >
                <form onSubmit={handleSubmitType} className="space-y-4">
                    {/* Type Name */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t("typeNameRequired")}</label>
                        <Input
                            placeholder={language === "sinhala" ? "උදා: කුඩු, දියර, ඇසුරුම්" : "e.g., Powder, Liquid, Packaging"}
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Type Unit */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t("unit")}</label>
                        <Input
                            placeholder={language === "sinhala" ? "උදා: කි.ග්‍රෑ., ලීටර්, සෙ.මී." : "e.g., Kg, L, cm"}
                            value={typeUnit}
                            onChange={(e) => setTypeUnit(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
                        >
                            {t("cancel")}
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                            {t("add")}
                        </Button>
                    </div>
                </form>
            </ModalOverlay>

            {/* Types List */}
            <Card className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">{t("materialTypeList")}</h2>
                <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("typeName")}</th>
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("unitCost")}</th>
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">{t("actions")}</th>
                    </tr>
                    </thead>
                        <tbody>
                        {types.map((type) => (
                            <tr key={type._id} className="border-b hover:bg-secondary/50">
                                <td className="py-3 px-4 text-xs md:text-sm">{type.name}</td>
                                <td className="py-3 px-4 text-xs md:text-sm">{type.unit}</td>
                                <td className="py-3 px-4 space-x-5">
                                    <button
                                        onClick={() => handleDeleteType(type._id)}
                                        className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(type)}
                                        className="inline-flex items-center gap-1"
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
        </div>
    )
}
