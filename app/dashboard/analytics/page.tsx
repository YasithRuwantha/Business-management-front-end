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
    { name: "John Doe", spent: 5240, orders: 45 },
    { name: "Jane Smith", spent: 8750, orders: 62 },
    { name: "Bob Johnson", spent: 3210, orders: 28 },
    { name: "Alice Brown", spent: 6420, orders: 51 },
    { name: "Charlie Davis", spent: 4850, orders: 38 },
  ],
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

const KPICard = ({ title, value, change, icon }) => (
  <Card className="p-6 lg:p-8 border-0 shadow-sm hover:shadow-md transition-shadow">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl lg:text-4xl font-bold text-foreground">{value}</p>
        <p className="text-xs font-medium text-green-600">{change}</p>
      </div>
    </div>
  </Card>
)

export default function AnalyticsPage() {
  const totalRevenue = "$127,450"
  const totalProfit = "$29,550"
  const totalItems = "1,847"

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Overview of your sales performance and metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Total Revenue" value={totalRevenue} change="+12% from last month"  />
        <KPICard title="Total Profit" value={totalProfit} change="+8% from last month"  />
        <KPICard title="Items Sold" value={totalItems} change="+15% from last month"  />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Monthly Revenue</h2>
              <p className="text-sm text-muted-foreground mt-1">Revenue trend over the last 6 months</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profit Chart */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Monthly Profit</h2>
              <p className="text-sm text-muted-foreground mt-1">Profit trend over the last 6 months</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.monthlyProfit} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Products and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Sold Products */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Most Sold Products</h2>
              <p className="text-sm text-muted-foreground mt-1">Product distribution by sales volume</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
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
          </div>
        </Card>

        {/* Top Customers Card */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Top Customers</h2>
              <p className="text-sm text-muted-foreground mt-1">Your best customers by total spending</p>
            </div>
            <div className="space-y-4">
              {data.topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">${customer.spent.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Customers Table */}
      <Card className="p-6 lg:p-8 border-0 shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Customer Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive customer metrics and activity</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Customer Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Total Orders</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Total Spent</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-foreground">{customer.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{customer.orders}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-foreground">
                      ${customer.spent.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      ${(customer.spent / customer.orders).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
