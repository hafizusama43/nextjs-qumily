"use client"
import TemplateHeader from '@/components/ui/_header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter } from '@/lib/helpers';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

const page = () => {
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])
    const getData = useCallback(async () => {
        try {
            console.log('Fetching campaign data')
            setPending(true)
            const res = await axios.get(`/api/campaigns/campaign-data?slug=${params.slug}`);
            if (res.data.success) {
                setData(res.data.data)
            }
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }, [params.slug])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <div>
            <TemplateHeader>
                <Label>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</Label>
                <div className=''>
                    <Button size='sm'>Download excel</Button>
                    <Link className='ml-2' href={`/campaigns/${params.slug}/edit`}><Button size='sm'>Edit campaign</Button></Link>
                </div>
            </TemplateHeader>
        </div>
    )
}

export default page