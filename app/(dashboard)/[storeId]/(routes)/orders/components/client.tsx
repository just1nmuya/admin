/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import type { OrderColumn } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ApiList } from "@/components/ui/api-list"
import { Badge } from "@/components/ui/badge"

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for animation
  setTimeout(() => {
    setIsLoading(false)
  }, 500)

  const columns = [
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }: { row: any }) => <div className="max-w-[500px] truncate">{row.original.products}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: { row: any }) => <div className="max-w-[200px] truncate">{row.original.address}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "isPaid",
      header: "Payment Status",
      cell: ({ row }: { row: any }) => (
        <Badge variant={row.original.isPaid ? "default" : "destructive"}>
          {row.original.isPaid ? "Paid" : "Pending"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
  ]

  return (
    <>
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Card className="slide-in-from-bottom-5 duration-300 delay-100">
          <CardHeader className="px-6 py-4">
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={data} searchKey="products" />
          </CardContent>
        </Card>
      </div>
      {/* <Card className="slide-in-from-bottom-5 duration-300 delay-200">
        <CardHeader>
          <CardTitle>API</CardTitle>
          <CardDescription>API calls for Orders</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiList entityName="orders" entityIdName="orderId" />
        </CardContent>
      </Card> */}
    </>
  )
}

