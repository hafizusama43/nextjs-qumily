"use client"

import { useParams } from 'next/navigation';
import React from 'react'
import TemplateHeader from '../_header';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/lib/helpers';


const EditTemplate = () => {
    const params = useParams<{ slug: string }>();
    return (
        <div>
            <TemplateHeader>
                <Label>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</Label>
                <Link href={`/templates/${params.slug}/edit`}><Button size='sm'>Edit template</Button></Link>
            </TemplateHeader>
            Campaign template {params.slug}
        </div>
    )
}

export default EditTemplate
