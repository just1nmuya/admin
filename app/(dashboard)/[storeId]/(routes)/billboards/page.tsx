import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { BillboardClient } from "./components/client"
import type { BillboardColumn } from "./components/columns"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// Update the type to use a Promise for params
const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  // Await the promise to extract the storeId
  const { storeId } = await params

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))

  return (
    <div className="flex-col animate-in fade-in duration-500">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        <div className="flex flex-col gap-2 slide-in-from-left-5 duration-300">
          <Heading title={`Billboards (${billboards.length})`} description="Manage your store billboards" />
          <Separator />
        </div>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage

