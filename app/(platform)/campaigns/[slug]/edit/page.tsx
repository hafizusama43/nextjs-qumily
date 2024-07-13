"use client"
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Brands from './(campaigns)/brands/brands';
import Display from './(campaigns)/display/display';
import Products from './(campaigns)/products/products';

const EditCampaign = () => {
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])

    const getData = useCallback(async () => {
        try {
            setPending(true)
            const res = await axios.get(`/api/campaigns/${params.slug}`);
            if (res.data.success) {
                setData(res.data.data)
                console.log(res.data.data[0].campaign_category)
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
        <div className='mb-20'>
            {pending ? <Skeleton className="h-[400px] w-[100%] rounded-xl" /> :
                <React.Fragment>
                    {/* Need to mount the form according to campaign category */}
                    {data[0] && data[0].campaign_category === "sponsored-products-campaigns" && <Products></Products>}
                    {data[0] && data[0].campaign_category === "sponsored-display-campaigns" && <Display></Display>}
                    {data[0] && data[0].campaign_category === "sponsored-brands-campaigns" && <Brands></Brands>}
                </React.Fragment>
            }
        </div>
    )
}

export default EditCampaign