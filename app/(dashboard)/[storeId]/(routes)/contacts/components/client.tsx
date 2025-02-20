"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ContactColumn, columns } from "./columns";

interface ContactClientProps {
  data: ContactColumn[];
}

export const ContactClient: React.FC<ContactClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Contacts (${data.length})`}
        description="Manage Contacts for your store"
      />
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
