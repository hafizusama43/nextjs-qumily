"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Templates = {
    campaign_templates_id: string | number
    camping_name: string
    created_by: string | number
    created_at: string
}

export const columns: ColumnDef<Templates>[] = [
    {
        accessorKey: "campaign_templates_id",
        header: "Id",
    },
    {
        accessorKey: "camping_name",
        header: "Campaign name",
    },
    {
        accessorKey: "created_by",
        header: "Created by",
    },
    {
        accessorKey: "created_at",
        header: "Created at",
    },
]
