"use client"


import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spin } from '@/components/ui/spin';
import ZoomControl from './_zoom';
import TemplateHeader from '../../_header';

const EditTemp = () => {
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])
    const [editableCell, setEditableCell] = useState(null);

    const getData = useCallback(async () => {
        try {
            console.log('Fetching template data')
            setPending(true)
            const res = await axios.get(`/api/template-data?slug=${params.slug}`);
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

    // Function to handle cell double-click
    const handleCellDoubleClick = (id, field) => {
        console.log(id)
        console.log(field)
        setEditableCell({ id, field });
    };

    return (
        <div>
            <TemplateHeader>
                <Label>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</Label>
                <Link href={`/templates/${params.slug}/edit`}><Button size='sm'>Edit template</Button></Link>
            </TemplateHeader>
            <ZoomControl></ZoomControl>
            <Table className='mb-40 border rounded custom-template-table'>
                <TableHeader>
                    <TableRow>
                        {Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).map((item, index) => <TableHead key={item}>{SPONSORED_PRODUCTS_CAMPAIGNS[item]}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? <>{data.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'product')}>{item.product}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'entity')}>{item.entity}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'operation')}>{item.operation}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'campaign_id')}>{item.campaign_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'ad_group_id')}>{item.ad_group_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'portfolio_id')}>{item.portfolio_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'ad_id')}>{item.ad_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'keyword_id')}>{item.keyword_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'product_targeting_id')}>{item.product_targeting_id}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'campaign_name')}>{item.campaign_name}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'ad_group_name')}>{item.ad_group_name}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'start_date')}>{item.start_date}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'end_date')}>{item.end_date}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'targeting_type')}>{item.targeting_type}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'state')}>{item.state}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'daily_budget')}>{item.daily_budget}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'sku')}>{item.sku}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'ad_group_default_bid')}>{item.ad_group_default_bid}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'bid')}>{item.bid}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'keyword_text')}>{item.keyword_text}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'match_type')}>{item.match_type}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'bidding_strategy')}>{item.bidding_strategy}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'placement')}>{item.placement}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'percentage')}>{item.percentage}</TableCell>
                                <TableCell onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, 'product_targeting_expression')}>{item.product_targeting_expression}</TableCell>
                            </TableRow>
                        )
                    })}</> : <TableRow ><TableCell className="text-center" colSpan={Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).length}>
                        {pending ? <Spin className="m-auto" variant="light" size="default"></Spin> : 'No results.'}</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

export default EditTemp
