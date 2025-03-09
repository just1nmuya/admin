"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "./dashboard-card"
import { formatter } from "@/lib/utils"
import { CreditCard, DollarSign, Package } from "lucide-react"
import { subscribeToRealTimeUpdates } from "@/lib/dashboard-utils"

interface RealTimeDashboardProps {
  storeId: string
  initialData: {
    totalRevenue: number
    previousRevenue: number
    salesCount: number
    previousSales: number
    stockCount: number
    lowStockThreshold: number
  }
}

export function RealTimeDashboard({ storeId, initialData }: RealTimeDashboardProps) {
  const [data, setData] = useState(initialData)

  // Calculate trends
  const revenueTrend = calculateTrend(data.totalRevenue, data.previousRevenue)
  const salesTrend = calculateTrend(data.salesCount, data.previousSales)
  const stockTrend = data.stockCount <= data.lowStockThreshold ? "down" : "up"

  // Format trend values
  const revenueTrendValue = formatTrendPercentage(data.totalRevenue, data.previousRevenue)
  const salesTrendValue = formatTrendPercentage(data.salesCount, data.previousSales)
  const stockTrendValue = data.stockCount <= data.lowStockThreshold ? "Low stock" : "In stock"

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRealTimeUpdates(storeId, (newData) => {
      setData((prevData) => ({
        ...prevData,
        totalRevenue: newData.totalRevenue || prevData.totalRevenue,
        salesCount: newData.salesCount || prevData.salesCount,
        stockCount: newData.stockCount || prevData.stockCount,
      }))
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [storeId])

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Total Revenue"
        value={formatter.format(data.totalRevenue)}
        icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
        trend={revenueTrend}
        trendValue={revenueTrendValue}
        trendPeriod="from last month"
      />

      <DashboardCard
        title="Sales"
        value={data.salesCount.toString()}
        icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        trend={salesTrend}
        trendValue={salesTrendValue}
        trendPeriod="from last month"
        valuePrefix="+"
      />

      <DashboardCard
        title="Products in Stock"
        value={data.stockCount.toString()}
        icon={<Package className="h-5 w-5 text-purple-500" />}
        trend={stockTrend}
        trendValue={stockTrendValue}
      />
    </div>
  )
}

// Helper functions for trend calculations
function calculateTrend(current: number, previous: number): "up" | "down" | "neutral" {
  if (current > previous) return "up"
  if (current < previous) return "down"
  return "neutral"
}

function formatTrendPercentage(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%"

  const percentageChange = ((current - previous) / previous) * 100
  const sign = percentageChange > 0 ? "+" : ""
  return `${sign}${percentageChange.toFixed(1)}%`
}

