"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spin } from "@/components/ui/spin"
import { EyeIcon, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ConfirmDialog from "@/components/ui/confirmDialog";
import TemplateTooltip from "@/components/ui/_tooltip";

// Define the type for your data
interface MyData {
    id: string;
    // other fields...
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    pending: boolean,
}

export function DataTable<TData extends MyData, TValue>({
    pending,
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    // Add the actions column
    const extendedColumns = [
        ...columns,
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <TemplateTooltip title={"Delete template"}>
                        <ConfirmDialog confirmAction={() => handleDelete(row.original.campaign_templates_id, row.original.slug)}>
                            <Trash2 role="button" color="red" />
                        </ConfirmDialog>
                    </TemplateTooltip>
                    <TemplateTooltip title={"Edit template"} >
                        <Link href={`/campaigns/${row.original.slug}/edit?category=${row.original.campaign_category}`}>
                            <PencilLine role="button" color="green" />
                        </Link>
                    </TemplateTooltip>
                    <TemplateTooltip title={"View template"} >
                        <Link href={`/campaigns/${row.original.slug}?category=${row.original.campaign_category}`}>
                            <EyeIcon role="button" />
                        </Link>
                    </TemplateTooltip>
                </div>
            ),
        }
    ]

    const table = useReactTable({
        data,
        columns: extendedColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleDelete = (id: string, slug: string) => {
        console.log('Edit id:', id)
        console.log('Edit slug:', slug)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={extendedColumns.length} className="h-24 text-center">
                                {pending ? <Spin className="m-auto" variant="light" size="default"></Spin> : 'No results.'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
