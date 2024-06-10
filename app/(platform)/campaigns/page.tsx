import React from 'react'
import { Label } from '@/components/ui/label'
import TemplateHeader from '@/components/ui/_header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Campaigns = () => {
    return (
        <TemplateHeader>
            <Label>All campaigns</Label>
            <Link href="/campaigns/create"><Button size='sm'>Create new campaign</Button></Link>
        </TemplateHeader>
    )
}

export default Campaigns