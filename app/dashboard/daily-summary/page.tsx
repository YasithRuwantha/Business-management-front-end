"use client"

import { useLanguage } from "@/lib/auth-context";
import { Card } from "@/components/ui/card"
import { useCustomers } from "@/lib/customers-context"
import { useEffect, useState } from "react"
import { useSales } from "@/lib/sales-context"

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
  const { language } = useLanguage();
  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        monthlySalesSummary: "මාසික විකුණුම් සාරාංශය",
        overview: "මෙම මාසයේ විකුණුම් කාර්ය සාධනය සහ මැට්‍රික්ස් සාරාංශය.",
        thisMonthSales: "මෙම මාසයේ විකුණුම්",
        fromLastMonth: "පසුගිය මාසයෙන්",
        totalProfit: "මුළු ලාභය",
        itemsSold: "විකුණුම් කළ අයිතම",
        topCustomers: "ඉහළම පාරිභෝගිකයින්",
        weeklyPerformance: "සතිපතා කාර්ය සාධනය",
        week: "සතිය",
        sales: "විකුණුම්",
        profit: "ලාභය",
        items: "අයිතම",
        avgOrderValue: "සාමාන්‍ය ඇණවුම් වටිනාකම",
        monthlyBreakdown: "මාසික විස්තරය",
        salesUSD: "විකුණුම් ($)",
        profitUSD: "ලාභය ($)",
        itemsSoldCol: "විකුණුම් කළ අයිතම",
        avgOrderValueCol: "සාමාන්‍ය ඇණවුම් වටිනාකම ($)",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      monthlySalesSummary: "Monthly Sales Summary",
      overview: "Overview of this month's sales performance and metrics.",
      thisMonthSales: "This Month's Sales",
      fromLastMonth: "% from last month",
      totalProfit: "Total Profit",
      itemsSold: "Items Sold",
      topCustomers: "Top Customers",
      weeklyPerformance: "Weekly Performance",
      week: "Week",
      sales: "Sales",
      profit: "Profit",
      items: "Items",
      avgOrderValue: "Avg. Order Value",
      monthlyBreakdown: "Monthly Breakdown",
      salesUSD: "Sales",
      profitUSD: "Profit",
      itemsSoldCol: "Items Sold",
      avgOrderValueCol: "Avg. Order Value",
    };
    return en[key] || key;
  };
  const salesChange = calculatePercentChange(currentMonthData.totalSales, currentMonthData.lastMonthSales)
  const profitChange = calculatePercentChange(currentMonthData.totalProfit, currentMonthData.lastMonthProfit)
  const itemsChange = calculatePercentChange(currentMonthData.totalItems, currentMonthData.lastMonthItems)

  // const { fetchSales, fetchYearlyStats } = useSales();
  // const { yearlyTopCustomers, fetchYearlyTopCustomers } = useCustomers()

  // useEffect(() => {
  //   fetchYearlyTopCustomers()
  //   fetchYearlyStats(2025); // add relevent year
  // }, [])

  return (
    <div className="p-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">{t("monthlySalesSummary")}</h1>
        <p className="text-muted-foreground mt-2">{t("overview")}</p>
      </div>

      <div className="w-full gap-6">
        {/* This Month's Sales */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">{t("thisMonthSales")}</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">${currentMonthData.totalSales.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${salesChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {salesChange.isPositive ? "+" : ""}
            {salesChange.percentage}{t("fromLastMonth")}
          </p>
        </Card>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {/* Total Profit */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">{t("totalProfit")}</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">${currentMonthData.totalProfit.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${profitChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {profitChange.isPositive ? "+" : ""}
            {profitChange.percentage}{t("fromLastMonth")}
          </p>
        </Card>

        {/* Items Sold */}
        <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <p className="text-sm font-semibold text-gray-600">{t("itemsSold")}</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">{currentMonthData.totalItems.toLocaleString()}</p>
          <p className={`text-sm font-semibold mt-2 ${itemsChange.isPositive ? "text-green-600" : "text-red-600"}`}>
            {itemsChange.isPositive ? "+" : ""}
            {itemsChange.percentage}{t("fromLastMonth")}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Customers */}
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("topCustomers")}</h2>
          <div className="space-y-3">
            {/* {topCustomers.map((customer, index) => (
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
            ))} */}
          </div>
        </Card>

        {/* Weekly Performance */}
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("weeklyPerformance")}</h2>
          <div className="space-y-3">
            {currentMonthData.weeks.map((week, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{t("week")} {week.week}</p>
                  <p className="text-lg font-bold text-blue-600">${week.sales.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {t("profit")}: <span className="font-semibold text-gray-800">${week.profit.toLocaleString()}</span>
                  </span>
                  <span>
                    {t("items")}: <span className="font-semibold text-gray-800">{week.items}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("monthlyBreakdown")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 font-semibold text-foreground">{t("week")}</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">{t("salesUSD")}</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">{t("profitUSD")}</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">{t("itemsSoldCol")}</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">{t("avgOrderValueCol")}</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthData.weeks.map((week, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-foreground">{t("week")} {week.week}</td>
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
