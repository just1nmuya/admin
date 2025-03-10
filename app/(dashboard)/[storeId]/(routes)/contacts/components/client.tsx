"use client"

import type React from "react"

import { useState } from "react"
import type { ContactColumn } from "./columns"
import { DataTable } from "@/components/ui/data-table"
// import { ApiList } from "@/components/ui/api-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ContactClientProps {
  data: ContactColumn[]
}

export const ContactClient: React.FC<ContactClientProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for animation
  setTimeout(() => {
    setIsLoading(false)
  }, 500)

  return (
    <>
      <div className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Card className="slide-in-from-bottom-5 duration-300 delay-100">
          <CardHeader className="px-6 py-4">
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>View and manage customer inquiries and messages</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={[
                { accessorKey: "name", header: "Name" },
                { accessorKey: "email", header: "Email" },
                { accessorKey: "message", header: "Message" },
                { accessorKey: "createdAt", header: "Date" },
              ]}
              data={data}
              searchKey="email"
            />
          </CardContent>
        </Card>
      </div>
      {/* <Card className="slide-in-from-bottom-5 duration-300 delay-200">
        <CardHeader>
          <CardTitle>API</CardTitle>
          <CardDescription>API calls for Contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiList entityName="contacts" entityIdName="contactId" />
        </CardContent>
      </Card> */}
    </>
  )
}

