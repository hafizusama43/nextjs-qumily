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
import { PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateTooltip from "./_tooltip";

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
                    <TemplateTooltip title={"Delete template"} >
                        <Trash2 role="button" color="red" onClick={() => handleDelete(row.original.campaign_templates_id)} />
                    </TemplateTooltip>
                    <TemplateTooltip title={"Edit template"} >
                        <PencilLine role="button" color="green" onClick={() => handleEdit(row.original.campaign_templates_id)} />
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

    // Handlers for edit and delete actions
    const handleEdit = (id: string) => {
        console.log('Edit id:', id)
        // Your edit logic here
    }

    const handleDelete = (id: string) => {
        console.log('Delete id:', id)
        // Your delete logic here
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
