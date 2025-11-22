"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = {
  monthlyRevenue: [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 14000 },
    { month: "May", revenue: 20000 },
    { month: "Jun", revenue: 22000 },
  ],
  monthlyProfit: [
    { month: "Jan", profit: 3000 },
    { month: "Feb", profit: 4200 },
    { month: "Mar", profit: 5400 },
    { month: "Apr", profit: 4100 },
    { month: "May", profit: 6200 },
    { month: "Jun", profit: 6800 },
  ],
  topProducts: [
    { name: "Bread", value: 35 },
    { name: "Cake", value: 28 },
    { name: "Cookies", value: 25 },
    { name: "Donuts", value: 12 },
  ],
  topCustomers: [
    { name: "John Doe", spent: 5240 },
    { name: "Jane Smith", spent: 8750 },
    { name: "Bob Johnson", spent: 3210 },
    { name: "Alice Brown", spent: 6420 },
    { name: "Charlie Davis", spent: 4850 },
  ],
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Monthly Profit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyProfit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Most Sold Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.topProducts}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.topProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Customer Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-secondary">
                  <td className="py-3 px-4 text-sm">{customer.name}</td>
                  <td className="py-3 px-4 text-sm font-semibold">${customer.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
