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
    // const data = await getData()
    // const route = useRouter()
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            setPending(true)
            const res = await axios.get(`/api/campaigns/${params.slug}`);
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
        <TemplateHeader>
            <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
            <div className='flex gap-2'>
                <Button size='sm'>Save changes</Button>
                {/* <Link href={`/campa/${params.slug}/create-campaign`}><Button size='sm'>Create campaign</Button></Link> */}
                {/* <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button> */}
            </div>
        </TemplateHeader>
    )
}

export default page