"use client"

import { useLanguage } from "@/lib/auth-context";
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

import { useSales } from "@/lib/sales-context" 
import { useCustomers } from "@/lib/customers-context"
import { useEffect, useState } from "react"
import { useProducts } from "@/lib/product-context"
import { useProfit } from "@/lib/profit-context"
import { useSalesHistory } from "@/lib/sales-history"

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
  const { language } = useLanguage();
  // Hardcoded translations for Sinhala
  const t = (key: string) => {
    if (language === "sinhala") {
      const si: Record<string, string> = {
        analytics: "විශ්ලේෂණ",
        overview: "ඔබගේ විකුණුම් කාර්ය සාධනය සහ මැට්‍රික්ස් සාරාංශය",
        thisYearTotalRevenue: "මෙම වසරේ මුළු ආදායම",
        thisYearTotalProfit: "මෙම වසරේ මුළු ලාභය",
        thisYearCost: "මෙම වසරේ වියදම",
        monthlyRevenue: "මාසික ආදායම",
        revenueTrend: "වසර පුරා ආදායම් ප්‍රවණතාවය",
        monthlyProfit: "මාසික ලාභය",
        profitTrend: "පසුගිය මාස 6ක ලාභ ප්‍රවණතාවය",
        mostSoldProducts: "වැඩිම විකුණුම් වූ නිෂ්පාදන",
        productDistribution: "විකුණුම් ප්‍රමාණය අනුව නිෂ්පාදන බෙදාහැරීම",
        topCustomers: "ඉහළම පාරිභෝගිකයින්",
        bestCustomers: "ඔබගේ හොඳම පාරිභෝගිකයින්ගේ මුළු වියදම",
        customerDetails: "පාරිභෝගික විස්තර",
        customerMetrics: "සම්පූර්ණ පාරිභෝගික මැට්‍රික්ස් සහ ක්‍රියාකාරකම්",
        customerName: "පාරිභෝගික නම",
        totalOrders: "මුළු ඇණවුම්",
        totalSpent: "මුළු වියදම",
        avgOrderValue: "සාමාන්‍ය ඇණවුම් වටිනාකම",
        orders: "ඇණවුම්",
        spent: "වියදම",
      };
      return si[key] || key;
    }
    // English fallback
    const en: Record<string, string> = {
      analytics: "Analytics",
      overview: "Overview of your sales performance and metrics",
      thisYearTotalRevenue: "This Year Total Revenue",
      thisYearTotalProfit: "This Year Total Profit",
      thisYearCost: "This Year Cost",
      monthlyRevenue: "Monthly Revenue",
      revenueTrend: "Revenue trend over the year",
      monthlyProfit: "Monthly Profit",
      profitTrend: "Profit trend over the last 6 months",
      mostSoldProducts: "Most Sold Products",
      productDistribution: "Product distribution by sales volume",
      topCustomers: "Top Customers",
      bestCustomers: "Your best customers by total spending",
      customerDetails: "Customer Details",
      customerMetrics: "Comprehensive customer metrics and activity",
      customerName: "Customer Name",
      totalOrders: "Total Orders",
      totalSpent: "Total Spent",
      avgOrderValue: "Avg Order Value",
      orders: "orders",
      spent: "spent",
    };
    return en[key] || key;
  };
  const { profitChart, getCurrentYearMonthlyProfitChart, fetchProfitSummary, profit } = useProfit();

  const totalRevenue = "$127,450"
  const totalProfit = "$29,550"
  const totalItems = "1,847"

  const [ revenue, setRevenue ] = useState<Number>(0);
  const [ revenueChange ,setRevenueChange] = useState<Number>(0)

  const { fetchSales, fetchYearlyStats, fetchMonthlyRevenue, monthlyRevenue, fetchTotalRevenueByYear } = useSales();
  const { yearlyTopCustomers, fetchYearlyTopCustomers } = useCustomers();
  const { fetchTopProductsAlltime, topProductsAlltime } = useProducts();

  useEffect(() => {
    fetchYearlyTopCustomers()
    fetchYearlyStats(new Date().getFullYear());
    fetchMonthlyRevenue(new Date().getFullYear());
    fetchTopProductsAlltime();
    getCurrentYearMonthlyProfitChart();
    fetchProfitSummary();



    const loadRevenue = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // 1-12

      const { totalRevenue, percentageChange } = await fetchTotalRevenueByYear(year, month);
      setRevenue(totalRevenue);
      setRevenueChange(percentageChange);
    };

    loadRevenue();
      
  }, [])

  const pieData = (topProductsAlltime || [])
    .map(p => ({
      name: p.product,
      value: Number(p.percentage) || 0,
    }));


  return (
    <div className="p-6 lg:p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{t("analytics")}</h1>
        <p className="text-muted-foreground">{t("overview")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title={t("thisYearTotalRevenue")} value={`Rs. ${profit?.currentYear.revenue ?? 0}`} change="" icon={undefined}  />
        <KPICard title={t("thisYearTotalProfit")} value={`Rs. ${profit?.currentYear.profit ?? 0}`} change="" icon={undefined} />
        <KPICard title={t("thisYearCost")} value={`Rs. ${profit?.currentYear.cost ?? 0}`} change="" icon={undefined} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t("monthlyRevenue")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("revenueTrend")}</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                <Bar dataKey="totalRevenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profit Chart */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t("monthlyProfit")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("profitTrend")}</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={profitChart?.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <h2 className="text-lg font-bold text-foreground">{t("mostSoldProducts")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("productDistribution")}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
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
          </div>
        </Card>

        {/* Top Customers Card */}
        <Card className="p-6 lg:p-8 border-0 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{t("topCustomers")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("bestCustomers")}</p>
            </div>
            <div className="space-y-4">
              {yearlyTopCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.orderCount} {t("orders")}</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">${customer.totalSpent.toLocaleString()}</p>
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
            <h2 className="text-lg font-bold text-foreground">{t("customerDetails")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("customerMetrics")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">{t("customerName")}</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">{t("totalOrders")}</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">{t("totalSpent")}</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">{t("avgOrderValue")}</th>
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
