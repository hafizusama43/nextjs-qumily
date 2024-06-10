"use client"
import TemplateHeader from '@/components/ui/_header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import axios from 'axios';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Spin } from '@/components/ui/spin';

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

            <Table className='mb-40 border rounded custom-template-table'>
                <TableHeader>
                    <TableRow>
                        {Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).map((item) => <TableHead key={item}>{SPONSORED_PRODUCTS_CAMPAIGNS[item]}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? <>{data.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{item.product}</TableCell>
                                <TableCell>{item.entity}</TableCell>
                                <TableCell>{item.operation}</TableCell>
                                <TableCell>{item.campaign_id}</TableCell>
                                <TableCell>{item.ad_group_id}</TableCell>
                                <TableCell>{item.portfolio_id}</TableCell>
                                <TableCell>{item.ad_id}</TableCell>
                                <TableCell>{item.keyword_id}</TableCell>
                                <TableCell>{item.product_targeting_id}</TableCell>
                                <TableCell>{item.campaign_name}</TableCell>
                                <TableCell>{item.ad_group_name}</TableCell>
                                <TableCell>{item.start_date}</TableCell>
                                <TableCell>{item.end_date}</TableCell>
                                <TableCell>{item.targeting_type}</TableCell>
                                <TableCell>{item.state}</TableCell>
                                <TableCell>{item.daily_budget}</TableCell>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell>{item.ad_group_default_bid}</TableCell>
                                <TableCell>{item.bid}</TableCell>
                                <TableCell>{item.keyword_text}</TableCell>
                                <TableCell>{item.match_type}</TableCell>
                                <TableCell>{item.bidding_strategy}</TableCell>
                                <TableCell>{item.placement}</TableCell>
                                <TableCell>{item.percentage}</TableCell>
                                <TableCell>{item.product_targeting_expression}</TableCell>
                            </TableRow>
                        )
                    })}</> : <TableRow ><TableCell className="text-center" colSpan={Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).length}>
                        {pending ? <Spin className="m-auto" variant="light" size="default"></Spin> : 'No results.'}</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

export default page