"use client"
import { format } from "date-fns"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { TEMPLATE_CATEGORY } from "@/lib/helpers"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Templates = {
    campaign_templates_id: string | number
    camping_name: string
    username: string | number
    created_at: string
}

export const columns: ColumnDef<Templates>[] = [
    {
        accessorKey: "campaign_templates_id",
        header: "Id",
        // cell: ({ cell }) => <Link href={"/"}>{format(new Date(cell.getValue() as string), 'MM/dd/yyyy')}</Link>, // Format date here
    },
    {
        accessorKey: "template_name",
        header: "Template name",
    },
    {
        accessorKey: "template_category",
        header: "Template category",
        cell: ({ cell }) => TEMPLATE_CATEGORY[cell.getValue() as string], // Format date here
    },
    {
        accessorKey: "username",
        header: "Created by",
    },
    {
        accessorKey: "created_at",
        header: "Created at",
        cell: ({ cell }) => format(new Date(cell.getValue() as string), 'MM/dd/yyyy'), // Format date here
    },
    // {
    //     accessorKey: "actions",
    //     header: "Actions",
    // },
]
