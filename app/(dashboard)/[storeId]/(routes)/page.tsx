import { getGraphRevenue } from "@/actions/get-graph-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getStockCount } from "@/actions/get-stock-count"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { DashboardCard } from "@/components/dashboard-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Overview } from "@/components/overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPreviousPeriodData } from "@/lib/dashboard-utils"
import { formatter } from "@/lib/utils"
import { CreditCard, DollarSign, Package } from "lucide-react"


// Update the type for dynamic parameters so that params is a Promise
interface DashboardPageProps {
  params: Promise<{ storeId: string }>
}

// Export an async function (a server component) rather than a React.FC
export default async function DashboardPage({ params }: DashboardPageProps) {
  // Await the params to extract the storeId
  const { storeId } = await params

  // Execute all your async data fetching in parallel for performance optimization
  const totalRevenue = await getTotalRevenue(storeId)
  const salesCount = await getSalesCount(storeId)
  const stockCount = await getStockCount(storeId)
  const graphRevenue = await getGraphRevenue(storeId)

  // Get previous period data for trend calculations
  const { previousRevenue, previousSales, lowStockThreshold = 10 } = await getPreviousPeriodData()

  // Calculate trends
  const revenueTrend = calculateTrend(totalRevenue, previousRevenue)
  const salesTrend = calculateTrend(salesCount, previousSales)
  const stockTrend = stockCount <= lowStockThreshold ? "down" : "up"

  // Format trend values
  const revenueTrendValue = formatTrendPercentage(totalRevenue, previousRevenue)
  const salesTrendValue = formatTrendPercentage(salesCount, previousSales)
  const stockTrendValue = stockCount <= lowStockThreshold ? "Low stock" : "In stock"

  return (
    <div className="flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <DashboardHeader title="Dashboard" description="Overview of your store" />
        <Separator className="my-2" />

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Revenue"
            value={formatter.format(totalRevenue)}
            icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
            trend={revenueTrend}
            trendValue={revenueTrendValue}
            trendPeriod="from last month"
          />

          <DashboardCard
            title="Sales"
            value={salesCount.toString()}
            icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            trend={salesTrend}
            trendValue={salesTrendValue}
            trendPeriod="from last month"
            valuePrefix="+"
          />

          <DashboardCard
            title="Products in Stock"
            value={stockCount.toString()}
            icon={<Package className="h-5 w-5 text-purple-500" />}
            trend={stockTrend}
            trendValue={stockTrendValue}
          />
        </div>

        <Card className="col-span-4 overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-muted/30">
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
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

