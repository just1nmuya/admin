"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
// import { ApiList } from "@/components/ui/api-list"
import { type CategoryColumn, columns } from "./columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryClientProps {
  data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for animation
  setTimeout(() => {
    setIsLoading(false)
  }, 500)

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 slide-in-from-left-5 duration-300 delay-100">
        <Card className="w-full sm:w-auto p-4 bg-muted/30 border-dashed">
          <CardDescription>Categories help organize your products and are linked to billboards</CardDescription>
        </Card>
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
          className="w-full sm:w-auto slide-in-from-right-5 duration-300 delay-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Card className="slide-in-from-bottom-5 duration-300 delay-100">
          <CardHeader className="px-6 py-4">
            <CardTitle>Categories</CardTitle>
            <CardDescription>View and manage your product categories</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={data} searchKey="name" />
          </CardContent>
        </Card>
      </div>

      {/* <Card className="mt-6 slide-in-from-bottom-5 duration-300 delay-200">
        <CardHeader>
          <CardTitle>API</CardTitle>
          <CardDescription>API calls for Categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiList entityName="categories" entityIdName="categoryId" />
        </CardContent>
      </Card> */}
    </>
  )
}

