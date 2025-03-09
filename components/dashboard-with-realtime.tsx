/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGraphRevenue } from "@/actions/get-graph-revenue"
import { getSalesCount } from "@/actions/get-sales-count"
import { getStockCount } from "@/actions/get-stock-count"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Overview } from "@/components/overview"
import { DashboardHeader } from "./dashboard-header"
import { RealTimeDashboard } from "./real-time-dashboard"
import { getPreviousPeriodData } from "@/lib/dashboard-utils"

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
  const graphRevenue = (await getGraphRevenue(storeId)).map((data: any) => ({
    ...data,
    month: data.month ?? new Date().getMonth() + 1, // Ensure month is included
  }))

  // Get previous period data for trend calculations
  const { previousRevenue, previousSales, lowStockThreshold = 10 } = await getPreviousPeriodData()

  return (
    <div className="flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <DashboardHeader title="Dashboard" description="Overview of your store" />
        <Separator className="my-2" />

        <RealTimeDashboard
          storeId={storeId}
          initialData={{
            totalRevenue,
            previousRevenue,
            salesCount,
            previousSales,
            stockCount,
            lowStockThreshold,
          }}
        />

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

