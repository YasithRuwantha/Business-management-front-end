"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, X, Plus } from "lucide-react"

interface OrderItem {
  product: string
  quantity: number
  price: number
  total: number
}

interface Sale {
  id: number
  customer: string
  items: OrderItem[]
  totalAmount: number
  date: string
}

const initialSales: Sale[] = [
  {
    id: 1,
    customer: "John Doe",
    items: [
      { product: "Bread", quantity: 10, price: 3.5, total: 35.0 },
      { product: "Cookies", quantity: 5, price: 4.0, total: 20.0 },
    ],
    totalAmount: 55.0,
    date: "2024-11-20",
  },
  {
    id: 2,
    customer: "Jane Smith",
    items: [{ product: "Cake", quantity: 2, price: 8.0, total: 16.0 }],
    totalAmount: 16.0,
    date: "2024-11-20",
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [showModal, setShowModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [formData, setFormData] = useState({
    customer: "",
    items: [{ product: "", quantity: "", price: "" }],
  })

  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", quantity: "", price: "" }],
    })
  }

  const removeItemField = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault()

    const validItems = formData.items.filter((item) => item.product && item.quantity && item.price)

    if (!formData.customer || validItems.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const orderItems: OrderItem[] = validItems.map((item) => ({
      product: item.product,
      quantity: Number.parseFloat(item.quantity),
      price: Number.parseFloat(item.price),
      total: Number.parseFloat(item.quantity) * Number.parseFloat(item.price),
    }))

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0)

    const newSale: Sale = {
      id: sales.length + 1,
      customer: formData.customer,
      items: orderItems,
      totalAmount,
      date: new Date().toISOString().split("T")[0],
    }

    setSales([...sales, newSale])
    setFormData({ customer: "", items: [{ product: "", quantity: "", price: "" }] })
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    setSales(sales.filter((s) => s.id !== id))
  }

  const viewDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDetailsModal(true)
  }

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-xs md:text-base text-muted-foreground mt-1">
            Record and manage sales with multiple items per order
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-sm md:text-base py-2 md:py-2.5"
        >
          Record Sale
        </Button>
      </div>

      {/* Sales Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card p-4 md:p-6 border-b flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Record New Sale</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Customer Name *</label>
                <Input
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="text-base"
                />
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-semibold text-foreground">Order Items</h3>
                  <button
                    type="button"
                    onClick={addItemField}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm md:text-base"
                  >
                    <Plus size={20} />
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pb-3 md:pb-4 border-b">
                    <Input
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => updateItem(index, "product", e.target.value)}
                      className="sm:col-span-5 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="sm:col-span-3 sm:col-span-2 text-sm"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", e.target.value)}
                      className="sm:col-span-3 text-sm"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemField(index)}
                        className="sm:col-span-2 flex justify-center sm:justify-end text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm md:text-base py-2 md:py-2.5"
                >
                  Save Sale
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary hover:bg-muted text-foreground text-sm md:text-base py-2 md:py-2.5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-4 md:p-6 border-b bg-card flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Order ID</p>
                  <p className="text-lg md:text-xl font-semibold text-foreground">#{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Date</p>
                  <p className="text-lg md:text-xl font-semibold text-foreground">{selectedSale.date}</p>
                </div>
              </div>

              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Customer</p>
                <p className="text-lg md:text-xl font-semibold text-foreground">{selectedSale.customer}</p>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-bold text-foreground mb-3 md:mb-4">Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 md:px-3 font-semibold text-foreground">Product</th>
                        <th className="text-right py-2 px-2 md:px-3 font-semibold text-foreground">Qty</th>
                        <th className="text-right py-2 px-2 md:px-3 font-semibold text-foreground">Price</th>
                        <th className="text-right py-2 px-2 md:px-3 font-semibold text-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.items.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-secondary">
                          <td className="py-2 px-2 md:px-3 text-xs md:text-sm">{item.product}</td>
                          <td className="text-right py-2 px-2 md:px-3 text-xs md:text-sm">{item.quantity}</td>
                          <td className="text-right py-2 px-2 md:px-3 text-xs md:text-sm">${item.price.toFixed(2)}</td>
                          <td className="text-right py-2 px-2 md:px-3 text-xs md:text-sm font-semibold text-green-600">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-secondary p-3 md:p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="font-semibold text-foreground text-sm md:text-base">Total Amount</p>
                <p className="text-xl md:text-2xl font-bold text-primary">${selectedSale.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sales Summary Card */}
      <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-xs md:text-sm text-gray-600 font-medium">Total Sales Revenue</p>
            <p className="text-2xl md:text-4xl font-bold text-blue-700 mt-2">${totalSales.toFixed(2)}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Total Orders</p>
            <p className="text-2xl md:text-4xl font-bold text-blue-700 mt-2">{sales.length}</p>
          </div>
        </div>
      </Card>

      {/* Sales List */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground">Sales Orders</h2>
          <div className="space-x-1 md:space-x-2 flex flex-wrap gap-2">
            {["all", "today", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition-all ${
                  filterPeriod === period
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">ID</th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Customer</th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Items</th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Amount</th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Date</th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-secondary transition-colors">
                  <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-primary">#{sale.id}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4 font-medium">{sale.customer}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4">{sale.items.length} item(s)</td>
                  <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-green-600">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4 text-muted-foreground">{sale.date}</td>
                  <td className="py-2 md:py-3 px-2 md:px-4">
                    <div className="flex gap-1 md:gap-2">
                      <button
                        onClick={() => viewDetails(sale)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs md:text-sm"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
