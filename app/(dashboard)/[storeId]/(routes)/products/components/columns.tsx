// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";

// export type ProductColumn = {
//   id: string;
//   name: string;
//   price: string;
//   size: string;
//   category: string;
//   color: string;
//   isFeatured: boolean;
//   isArchived: boolean;
//   createdAt: string;
// };

// export const columns: ColumnDef<ProductColumn>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "isArchived",
//     header: "Archived",
//   },
//   {
//     accessorKey: "isFeatured",
//     header: "Featured",
//   },
//   {
//     accessorKey: "price",
//     header: "Price",
//   },
//   {
//     accessorKey: "category",
//     header: "Category",
//   },
//   {
//     accessorKey: "size",
//     header: "Size",
//   },
//   {
//     accessorKey: "color",
//     header: "Color",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-x-2">
//         {row.original.color}
//         <div
//           className="h-6 w-6 rounded-full boredr"
//           style={{ backgroundColor: row.original.color }}
//         />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Date",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <CellAction data={row.original} />,
//   },
// ];

"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.isArchived ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            <span>Yes</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <X className="h-3.5 w-3.5" />
            <span>No</span>
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.isFeatured ? (
          <Badge variant="default" className="flex items-center gap-1 bg-green-600">
            <Check className="h-3.5 w-3.5" />
            <span>Yes</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <X className="h-3.5 w-3.5" />
            <span>No</span>
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.size}
      </Badge>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div className="h-6 w-6 rounded-full border shadow-sm" style={{ backgroundColor: row.original.color }} />
        <span className="text-sm">{row.original.color}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]

