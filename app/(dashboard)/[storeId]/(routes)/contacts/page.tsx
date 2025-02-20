import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ContactClient } from "./components/client";
import { ContactColumn } from "./components/columns";

// Define params as a Promise resolving to an object with storeId
const ContactsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  // Await the params to extract storeId
  const { storeId } = await params;

  const contacts = await prismadb.contact.findMany({
    where: {
      storeId,
    },
    
  });

  const formattedOrders: ContactColumn[] = contacts.map((item: { id: string; name: string; email: string; message: string; createdAt: Date }) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    message: item.message,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ContactClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default ContactsPage;
