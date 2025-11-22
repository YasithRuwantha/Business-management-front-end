"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { ModalOverlay } from "@/components/modal-overlay"

const initialCustomers = [
  { id: 1, name: "John Doe", phone: "+1 (555) 123-4567", address: "123 Main St, City", totalSpent: 5240 },
  { id: 2, name: "Jane Smith", phone: "+1 (555) 234-5678", address: "456 Oak Ave, Town", totalSpent: 8750 },
  { id: 3, name: "Bob Johnson", phone: "+1 (555) 345-6789", address: "789 Pine Rd, Village", totalSpent: 3210 },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" })

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone) {
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
        totalSpent: 0,
      }
      setCustomers([...customers, newCustomer])
      setFormData({ name: "", phone: "", address: "" })
      setIsModalOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Customers</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
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
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: "", phone: "", address: "" })
              }}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Customer
            </Button>
          </div>
        </form>
      </ModalOverlay>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Customer List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-4 text-sm">{customer.name}</td>
                  <td className="py-3 px-4 text-sm">{customer.phone}</td>
                  <td className="py-3 px-4 text-sm">{customer.address}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-primary">${customer.totalSpent}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleDelete(customer.id)}
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
