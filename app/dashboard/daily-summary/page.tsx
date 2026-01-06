"use client"

import { Card } from "@/components/ui/card"
import { useEffect } from "react"
import { useSales } from "@/lib/sales-context"

export default function MonthlySummaryPage() {
  const { fetchSalesMonthlyStat, monthlyStat, loading } = useSales()

  useEffect(() => {
    fetchSalesMonthlyStat()
  }, [])

  // ⛔ IMPORTANT: guard before accessing `.change`
  if (loading || !monthlyStat || !monthlyStat.change) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Loading monthly sales summary...</p>
      </div>
    )
  }

  // ✅ SAFE TO USE NOW
  const salesPercentage = monthlyStat.change.salesPercentage
  const itemsPercentage = monthlyStat.change.itemsPercentage

  const isSalesIncrease = salesPercentage >= 0
  const isItemsIncrease = itemsPercentage >= 0

  return (
    <div className="p-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Monthly Sales Summary</h1>
        <p className="text-muted-foreground mt-2">
          Overview of this month's sales performance and metrics.
        </p>
      </div>

      {/* This Month's Sales */}
      <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <p className="text-sm font-semibold text-gray-600">This Month's Sales</p>
        <p className="text-4xl font-bold text-blue-600 mt-3">
          ${monthlyStat.monthly.totalSalesAmount}
        </p>
        <p
          className={`text-sm font-semibold mt-2 ${
            isSalesIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSalesIncrease ? "+" : "-"}
          {Math.abs(salesPercentage)}% from last month
        </p>
      </Card>

      {/* Items Sold */}
      <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <p className="text-sm font-semibold text-gray-600">Items Sold</p>
        <p className="text-4xl font-bold text-blue-600 mt-3">
          {monthlyStat.monthly.totalItemsSold}
        </p>
        <p
          className={`text-sm font-semibold mt-2 ${
            isItemsIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {isItemsIncrease ? "+" : "-"}
          {Math.abs(itemsPercentage)}% from last month
        </p>
      </Card>

      {/* Weekly Performance */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Weekly Performance
        </h2>

        <div className="space-y-3">
          {Object.entries(monthlyStat.weeklyPerformance).map(
            ([weekKey, weekData], index) => (
              <div
                key={weekKey}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">
                    Week {index + 1}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    ${weekData.totalAmount.toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Items:{" "}
                  <span className="font-semibold text-gray-800">
                    {weekData.totalItems}
                  </span>
                </p>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  )
}
