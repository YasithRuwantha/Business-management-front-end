"use client"

import { Card } from "@/components/ui/card"
import { useCustomers } from "@/lib/customers-context"
import { useEffect, useState } from "react"
import { useSales } from "@/lib/sales-context"

const monthlyData = {
  sales: [
    {
      id: 1,
      month: "November",
      totalSales: 284650,
      totalProfit: 85240,
      totalItems: 1250,
      topCustomer: "Direct Sales",
      ordersCount: 42,
    },
    {
      id: 2,
      month: "October",
      totalSales: 256320,
      totalProfit: 76896,
      totalItems: 1120,
      topCustomer: "John Doe",
      ordersCount: 38,
    },
    {
      id: 3,
      month: "September",
      totalSales: 218940,
      totalProfit: 65682,
      totalItems: 980,
      topCustomer: "Direct Sales",
      ordersCount: 35,
    },
    {
      id: 4,
      month: "August",
      totalSales: 195670,
      totalProfit: 58701,
      totalItems: 875,
      topCustomer: "Jane Smith",
      ordersCount: 32,
    },
    {
      id: 5,
      month: "July",
      totalSales: 172450,
      totalProfit: 51735,
      totalItems: 765,
      topCustomer: "Direct Sales",
      ordersCount: 28,
    },
  ],
  topProducts: [
    { product: "Bread", units: 450, revenue: 85500 },
    { product: "Cake", units: 280, revenue: 78400 },
    { product: "Cookies", units: 220, revenue: 38500 },
    { product: "Donuts", units: 180, revenue: 32400 },
    { product: "Pastries", units: 120, revenue: 25200 },
  ],
}

const chartData = [
  { month: "July", sales: 172450, profit: 51735, orders: 28 },
  { month: "August", sales: 195670, profit: 58701, orders: 32 },
  { month: "September", sales: 218940, profit: 65682, orders: 35 },
  { month: "October", sales: 256320, profit: 76896, orders: 38 },
  { month: "November", sales: 284650, profit: 85240, orders: 42 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// Sample data for current month (November)
const currentMonthData = {
  totalSales: 28450,
  totalProfit: 12850,
  totalItems: 487,
  lastMonthSales: 23500,
  lastMonthProfit: 10900,
  lastMonthItems: 423,
  weeks: [
    { week: 1, sales: 5200, profit: 2340, items: 95, avgOrderValue: 54.74 },
    { week: 2, sales: 7100, profit: 3200, items: 128, avgOrderValue: 55.47 },
    { week: 3, sales: 8450, profit: 3810, items: 156, avgOrderValue: 54.17 },
    { week: 4, sales: 6700, profit: 3500, items: 108, avgOrderValue: 62.04 },
  ],
  topCustomers: [
    { name: "Acme Corp", orders: 85, sales: 8200 },
    { name: "Global Industries", orders: 120, sales: 7340 },
    { name: "Tech Solutions", orders: 142, sales: 6850 },
    { name: "Creative Labs", orders: 98, sales: 4200 },
    { name: "Direct Sales", orders: 42, sales: 1860 },
  ],
}

// Calculate percentage change
const calculatePercentChange = (current: number, previous: number) => {
  const change = ((current - previous) / previous) * 100
  return {
    percentage: change.toFixed(0),
    isPositive: change >= 0,
  }
}

export default function MonthlySummaryPage() {
  const salesChange = calculatePercentChange(currentMonthData.totalSales, currentMonthData.lastMonthSales)
  const profitChange = calculatePercentChange(currentMonthData.totalProfit, currentMonthData.lastMonthProfit)
  const itemsChange = calculatePercentChange(currentMonthData.totalItems, currentMonthData.lastMonthItems)

  const { fetchSales, fetchYearlyStats } = useSales();
  const { topCustomers, fetchTopCustomers } = useCustomers()

  useEffect(() => {
    fetchTopCustomers()
    fetchYearlyStats(2025); // add relevent year
  }, [])

  return (
    <div className="p-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Monthly Sales Summary</h1>
        <p className="text-muted-foreground mt-2">Overview of this month's sales performance and metrics.</p>
      </div>

      <div className="w-full gap-6">
        {/* This Month's Sales */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">This Month's Sales</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">${currentMonthData.totalSales.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${salesChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {salesChange.isPositive ? "+" : ""}
            {salesChange.percentage}% from last month
          </p>
        </Card>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {/* Total Profit */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">Total Profit</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">${currentMonthData.totalProfit.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${profitChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {profitChange.isPositive ? "+" : ""}
            {profitChange.percentage}% from last month
          </p>
        </Card>

        {/* Items Sold */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">Items Sold</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">{currentMonthData.totalItems.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${itemsChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {itemsChange.isPositive ? "+" : ""}
            {itemsChange.percentage}% from last month
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Customers */}
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-foreground mb-6">Top Customers</h2>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.orderCount} orders</p>
                </div>
                <p className="text-lg font-bold text-blue-600">${customer.totalSpent}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Performance */}
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Performance</h2>
          <div className="space-y-3">
            {currentMonthData.weeks.map((week, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">Week {week.week}</p>
                  <p className="text-lg font-bold text-blue-600">${week.sales.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Profit: <span className="font-semibold text-gray-800">${week.profit.toLocaleString()}</span>
                  </span>
                  <span>
                    Items: <span className="font-semibold text-gray-800">{week.items}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-foreground mb-6">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Week</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">Sales</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">Profit</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">Items Sold</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">Avg. Order Value</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthData.weeks.map((week, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-foreground">Week {week.week}</td>
                  <td className="text-right py-4 px-4 font-semibold text-blue-600">${week.sales.toLocaleString()}</td>
                  <td className="text-right py-4 px-4 font-semibold text-green-600">${week.profit.toLocaleString()}</td>
                  <td className="text-right py-4 px-4 text-foreground">{week.items}</td>
                  <td className="text-right py-4 px-4 text-foreground">${week.avgOrderValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
