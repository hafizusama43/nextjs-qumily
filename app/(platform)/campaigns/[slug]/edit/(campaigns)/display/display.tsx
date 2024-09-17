"use client"
import TemplateHeader from '@/components/ui/_header'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/Skeleton';
import { capitalizeFirstLetter } from '@/lib/helpers';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

const Display = () => {
    const params = useParams<{ slug: string }>();
    const [STEPS, setSteps] = useState({})

    return (
        <React.Fragment>
            <TemplateHeader>
                <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
                <div className='flex gap-2'>
                    <Link href="/campaigns">
                        <Button>Campaigns</Button>
                    </Link>
                </div>
            </TemplateHeader>
            {/* {pending ?
                <Skeleton className="h-[400px] w-[100%] rounded-xl" /> :
                <div className='border border-gray-300 p-5 rounded-lg'>
                    <strong><h5>{STEPS[currentStep]}</h5></strong>
                    {process.env.NEXT_PUBLIC_ENV === 'development' && <span className='text-red-400'>[Current Step : {currentStep}, Targeting Type : {targetingType} {targetingType == "Manual" && ",Targeting Strategy : " + targetingStrategy}]</span>}
                    <Separator className='mt-3 mb-3'></Separator>
                    <StepRenderer targetingType={targetingType} currentStep={currentStep} steps={STEPS} />
                </div>} */}
        </React.Fragment>
    )
}

export default Display