import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { OrderClient } from "./components/client"
import type { OrderColumn } from "./components/columns"
import { formatter } from "@/lib/utils"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// Define params as a Promise resolving to an object with storeId
const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  // Await the params to extract storeId
  const { storeId } = await params

  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => total + Number(orderItem.product.price), 0),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))

  return (
    <div className="flex-col animate-in fade-in duration-500">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        <div className="flex flex-col gap-2 slide-in-from-left-5 duration-300">
          <Heading title={`Orders (${orders.length})`} description="Manage your customer orders" />
          <Separator />
        </div>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage

