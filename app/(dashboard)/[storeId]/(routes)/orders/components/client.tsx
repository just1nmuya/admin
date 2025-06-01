/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import type { OrderColumn } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketModal } from "./TicketModal"
import { Button } from "@/components/ui/button"

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderColumn | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  const columns = [
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }: { row: any }) => <div className="max-w-[300px] truncate">{row.original.products}</div>,
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
    {
      id: "actions",
      header: "Ticket",
      cell: ({ row }: { row: any }) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSelectedOrder(row.original)}
        >
          Print Ticket
        </Button>
      ),
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

      {selectedOrder && (
        <div className="print-area">
          <TicketModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
        </div>
        
      )}
    </>
  )
}
