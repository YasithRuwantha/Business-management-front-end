"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Edit } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"
import { useRawMaterialTypes } from "@/lib/raw-material-type-context"


export default function RawMaterialTypesPage() {
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
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">Raw Material Types</h1>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                <Plus size={18} />
                    Add Type
                </Button>
            </div>

            {/* Add Type Modal */}
            <ModalOverlay
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Material Type"
            >
                <form onSubmit={handleSubmitType} className="space-y-4">
                    {/* Type Name */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Type Name *</label>
                        <Input
                            placeholder="e.g., Powder, Liquid, Packaging"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Type Unit */}
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Unit</label>
                        <Input
                            placeholder="e.g., Kg, L, cm"
                            value={typeUnit}
                            onChange={(e) => setTypeUnit(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Type Unit Cost */}
                    {/* <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Type Unit Cost (Rs.)</label>
                        <Input
                            placeholder="e.g.. Rs. 20.50"
                            value={typeUnitCost}
                            onChange={(e) => setTypeUnitCost(e.target.value)}
                            autoFocus
                        />
                    </div> */}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                            Add
                        </Button>
                    </div>
                </form>
            </ModalOverlay>

            {/* Types List */}
            <Card className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Material Type List</h2>

                <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Type Name</th>
                        {/* {/* <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Unit</th> */}
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Unit / Cost</th> 
                        <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                    </thead>

                        <tbody>
                        {types.map((type) => (
                            <tr key={type._id} className="border-b hover:bg-secondary/50">
                                <td className="py-3 px-4 text-xs md:text-sm">{type.name}</td>
                                <td className="py-3 px-4 text-xs md:text-sm">{type.unit}</td>
                                {/* <td className="py-3 px-4 text-xs md:text-sm">{type.unitCost}</td> */}
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
