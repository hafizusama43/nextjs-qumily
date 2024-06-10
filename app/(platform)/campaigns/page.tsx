"use client"

import React, { Suspense, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import TemplateHeader from '@/components/ui/_header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { DataTable } from './_data-table'
import { columns } from './_column'

const Campaigns = () => {
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
            const res = await axios.get('/api/campaigns');
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
            <TemplateHeader>
                <Label>All campaigns</Label>
                <Link href="/campaigns/create"><Button size='sm'>Create new campaign</Button></Link>
            </TemplateHeader>
            <Suspense fallback={<>Loading</>}>
                <DataTable columns={columns} data={data} pending={pending} />
            </Suspense>
        </div>

    )
}

export default Campaigns