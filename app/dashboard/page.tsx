"use client"

import { Card } from "@/components/ui/card"
import { useProducts } from "@/lib/product-context"
import { useEffect } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = {
  monthlyData: [
    { month: "Jan", sales: 4000, profit: 2400 },
    { month: "Feb", sales: 3000, profit: 1398 },
    { month: "Mar", sales: 2000, profit: 9800 },
    { month: "Apr", sales: 2780, profit: 3908 },
    { month: "May", sales: 1890, profit: 4800 },
    { month: "Jun", sales: 2390, profit: 3800 },
  ],
  topProducts: [
    { name: "Product A", sales: 35 },
    { name: "Product B", sales: 28 },
    { name: "Product C", sales: 18 },
    { name: "Product D", sales: 12 },
    { name: "Product E", sales: 7 },
  ],
  lowStock: [
    { name: "Material X", quantity: 5, unit: "kg" },
    { name: "Material Y", quantity: 3, unit: "liters" },
    { name: "Material Z", quantity: 8, unit: "boxes" },
  ],
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function DashboardPage() {
  const { fetchTopProductsAlltime, topProductsAlltime, getTotalAvailableProducts, totalAvailableProducts } = useProducts();
  

  useEffect(() => {
    fetchTopProductsAlltime();
    getTotalAvailableProducts();
  }, []);

  const pieData = (topProductsAlltime || [])
    .map(p => ({
      name: p.product,
      value: Number(p.percentage) || 0,
      }
    ));

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold text-foreground">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        <Card className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground">Total Raw Materials</p>
          <p className="text-2xl md:text-3xl font-bold text-primary mt-2">247</p>
        </Card>
        <Card className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl md:text-3xl font-bold text-primary mt-2">{totalAvailableProducts}</p>
        </Card>
        <Card className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground">Sales Today</p>
          <p className="text-2xl md:text-3xl font-bold text-primary mt-2">$12,450</p>
        </Card>
        <Card className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground">Sales This Month</p>
          <p className="text-2xl md:text-3xl font-bold text-primary mt-2">$284,650</p>
        </Card>
        <Card className="p-4 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground">Total Profit</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">$85,240</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Monthly Sales Chart */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Products Pie Chart */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Low Stock Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-foreground">
                  Material Name
                </th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-foreground">
                  Quantity
                </th>
                <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-foreground">Unit</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map((item, index) => (
                <tr key={index} className="border-b hover:bg-secondary">
                  <td className="py-3 px-2 md:px-4 text-sm">{item.name}</td>
                  <td className="py-3 px-2 md:px-4 text-sm font-semibold text-orange-600">{item.quantity}</td>
                  <td className="py-3 px-2 md:px-4 text-sm">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
