"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

const initialTypes = [
  { id: 1, name: "Powder" },
  { id: 2, name: "Liquid" },
  { id: 3, name: "Chemical" },
  { id: 4, name: "Packaging Material" },
]

export default function RawMaterialTypesPage() {
  const [types, setTypes] = useState(initialTypes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typeName, setTypeName] = useState("")

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault()

    if (!typeName.trim()) return

    const newType = {
      id: types.length + 1,
      name: typeName.trim(),
    }

    setTypes([...types, newType])
    setTypeName("")
    setIsModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setTypes(types.filter((t) => t.id !== id))
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
        <form onSubmit={handleAddType} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Type Name *</label>
            <Input
              placeholder="e.g., Powder, Liquid, Packaging"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              autoFocus
            />
          </div>

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
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>

            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border-b hover:bg-secondary/50">
                  <td className="py-3 px-4 text-xs md:text-sm">{type.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
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
