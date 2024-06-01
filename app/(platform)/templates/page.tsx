// "use client"

import React from 'react'
import { columns, Payment } from './column'
import { DataTable } from './data-table'
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'


async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        // ...
    ]
}

const Templates = async () => {
    const data = await getData()
    // const route = useRouter()

    return (
        <div>
            <h1 className='rounded mb-5 bg-gray-100 p-3 flex items-center justify-between'>
                <Label>All templates</Label>
                <Link href="/templates/add"><Button size='sm'>Add new template</Button></Link>
            </h1>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Templates
