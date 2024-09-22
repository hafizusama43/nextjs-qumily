"use client"
import TemplateHeader from '@/components/ui/_header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter, SPONSORED_BRANDS_CAMPAIGNS, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import ZoomControl from './_zoom';
import * as XLSX from "xlsx";
import Datatable from './_datatable';

const Campaigns = () => {
    const [campaignMapObj, setCampaignMapObj] = useState({})
    const searchParams = useSearchParams()
    const category = searchParams.get('category')
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])
    const getData = useCallback(async () => {
        try {
            console.log('Fetching campaign data')
            setPending(true)
            const res = await axios.get(`/api/campaigns/campaign-data?slug=${params.slug}&mode=view`);
            if (res.data.success) {
                console.log(res.data.data)
                setData(res.data.data.campaign_template_data)
            }
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }, [params.slug])

    useEffect(() => {
        if (category === 'sponsored-products-campaigns') {
            setCampaignMapObj(SPONSORED_PRODUCTS_CAMPAIGNS);
        } else if (category === 'sponsored-display-campaigns') {
            setCampaignMapObj(SPONSORED_PRODUCTS_CAMPAIGNS);
        }
        else if (category === 'sponsored-brands-campaigns') {
            setCampaignMapObj(SPONSORED_BRANDS_CAMPAIGNS);
        }
        getData()
    }, [category, getData])

    const createExcelSheet = () => {
        // const res = await axios.post(`/api/campaigns?slug=${params.slug}`, { data: prodData });
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => {
            const mappedItem = {};
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    if (category === 'sponsored-products-campaigns') {
                        mappedItem[SPONSORED_PRODUCTS_CAMPAIGNS[key]] = item[key];
                    } else if (category === 'sponsored-display-campaigns') {
                        mappedItem[SPONSORED_PRODUCTS_CAMPAIGNS[key]] = item[key];
                    }
                    else if (category === 'sponsored-brands-campaigns') {
                        mappedItem[SPONSORED_BRANDS_CAMPAIGNS[key]] = item[key];
                    }
                }
            }
            return mappedItem;
        }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sponsored Products Data');
        XLSX.writeFile(workbook, 'sponsored_products_data.xlsx');
    }

    return (
        <div>
            <TemplateHeader>
                <Label>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</Label>
                <div className=''>
                    <Button size='sm' className='block mb-2 md:inline md:mb-0' onClick={createExcelSheet}>Download excel</Button>
                    <Link className='md:ml-2 block w-full md:inline md:mb-0' href={`/campaigns/${params.slug}/edit?category=${category}`}><Button size='sm' className='max-md:w-full'>Edit campaign</Button></Link>
                </div>
            </TemplateHeader>
            <ZoomControl />
            <Datatable campaignMapObj={campaignMapObj} pending={pending} data={data} category={category} />
        </div>
    )
}

export default Campaigns