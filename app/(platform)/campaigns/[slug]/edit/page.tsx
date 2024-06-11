"use client"
import TemplateHeader from '@/components/ui/_header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter } from '@/lib/helpers';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Brands from './(campaigns)/brands';
import Display from './(campaigns)/display';
import Products from './(campaigns)/products/products';

const page = () => {
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [data, setData] = useState([])
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
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
    }


    return (
        <div>
            <TemplateHeader>
                <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
                <div className='flex gap-2'>
                    <Button size='sm'>Save changes</Button>
                    {/* <Link href={`/campa/${params.slug}/create-campaign`}><Button size='sm'>Create campaign</Button></Link> */}
                    {/* <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button> */}
                </div>
            </TemplateHeader>
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

export default page