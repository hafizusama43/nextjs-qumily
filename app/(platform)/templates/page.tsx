"use client"

import React, { Suspense, useEffect, useState } from 'react'
import { columns, Payment } from './column'
import { DataTable } from './data-table'
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'


// async function getData(): Promise<Payment[]> {
//     // Fetch data from your API here.
//     return [
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         // ...
//     ]
// }

const Templates = () => {
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])
    // const data = await getData()
    // const route = useRouter()
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            setPending(true)
            const res = await axios.get('/api/template');
            if (res.data.success) {
                setData(res.data.data)
            }
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }


    return (
        <div>
            <h1 className='rounded mb-5 bg-gray-100 p-3 flex items-center justify-between'>
                <Label>All templates</Label>
                <Link href="/templates/create"><Button size='sm'>Add new template</Button></Link>
            </h1>
            <Suspense fallback={<>Loading</>}>
                <DataTable columns={columns} data={data} pending={pending} />
            </Suspense>

        </div>
    )
}

export default Templates
