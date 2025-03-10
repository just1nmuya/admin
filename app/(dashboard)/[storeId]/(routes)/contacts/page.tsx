import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

import { ContactClient } from "./components/client"
import type { ContactColumn } from "./components/columns"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

// Define params as a Promise resolving to an object with storeId
const ContactsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>
}) => {
  // Await the params to extract storeId
  const { storeId } = await params

  const contacts = await prismadb.contact.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedOrders: ContactColumn[] = contacts.map(
    (item: { id: string; name: string; email: string; message: string; createdAt: Date }) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      message: item.message,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }),
  )

  return (
    <div className="flex-col animate-in fade-in duration-500">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        <div className="flex flex-col gap-2">
          <Heading title={`Contacts (${contacts.length})`} description="Manage your customer contacts" />
          <Separator />
        </div>
        <ContactClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default ContactsPage

