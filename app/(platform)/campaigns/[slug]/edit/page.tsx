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


    return (
        <TemplateHeader>
            <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
            <div className='flex gap-2'>
                <Button size='sm'>Download excel</Button>
                {/* <Link href={`/campa/${params.slug}/create-campaign`}><Button size='sm'>Create campaign</Button></Link> */}
                {/* <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button> */}
            </div>
        </TemplateHeader>
    )
}

export default page