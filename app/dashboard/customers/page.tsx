"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"
import { useCustomers } from "@/lib/customers-context"

type Customer = {
  id: string
  name: string
  phone: string
  address?: string
  totalSpent: number
}


export default function CustomersPage() {
  const { customers, loading, error, addCustomer, deleteCustomer } = useCustomers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("")

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return
    const created = await addCustomer({
      name: formData.name,
      phone: formData.phone,
      address: formData.address || "",
    })
    if (created) {
      setFormData({ name: "", phone: "", address: "" })
      setIsModalOpen(false)
    }
  }

  const openDeleteConfirm = (id: string, name: string) => {
    setPendingDeleteId(id)
    setPendingDeleteName(name)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!pendingDeleteId) return
    await deleteCustomer(pendingDeleteId)
    setConfirmOpen(false)
    setPendingDeleteId(null)
    setPendingDeleteName("")
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Customers</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus size={20} />
          Add Customer
        </Button>
      </div>

      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: "", phone: "", address: "" })
        }}
        title="Add New Customer"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
            <Input
              placeholder="Customer name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
            <Input
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Address</label>
            <Input
              placeholder="Address (optional)"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: "", phone: "", address: "" })
              }}
              className="sm:flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Customer
            </Button>
          </div>
        </form>
      </ModalOverlay>

      {/* Delete confirmation modal */}
      <ModalOverlay
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setPendingDeleteId(null)
          setPendingDeleteName("")
        }}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Are you sure you want to delete
            {" "}
            <span className="font-semibold">{pendingDeleteName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                setConfirmOpen(false)
                setPendingDeleteId(null)
                setPendingDeleteName("")
              }}
              className="sm:flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="sm:flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </ModalOverlay>

      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Customer List</h2>
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-muted-foreground">Loading...</div>
        )}
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-max md:min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Address</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Total Spent</th>
                <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-xs md:text-sm">{customer.name}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{customer.phone}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">{customer.address}</td>
                  <td className="py-3 px-4 text-xs md:text-sm font-semibold text-primary">${customer.totalSpent}</td>
                  <td className="py-3 px-4 text-xs md:text-sm">
                    <button
                      onClick={() => openDeleteConfirm(customer.id, customer.name)}
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
