"use client"
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'
import Step2 from './_step2'
import Step3 from './_step3'
import Step4 from './_step4'
import Step5 from './_step5'
import { capitalizeFirstLetter, STEPS } from '@/lib/helpers'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import TemplateHeader from '@/components/ui/_header'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Spin } from '@/components/ui/spin'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'


export const initialState = {
    product: '',
    entity: '',
    operation: '',
    campaign_id: '',
    ad_group_id: '',
    portfolio_id: '',
    ad_id: '',
    keyword_id: '',
    product_targeting_id: '',
    campaign_name: '',
    ad_group_name: '',
    start_date: '',
    end_date: '',
    targeting_type: '',
    state: '',
    daily_budget: 0,
    sku: '',
    ad_group_default_bid: 0,
    bid: '',
    keyword_text: '',
    match_type: '',
    bidding_strategy: '',
    placement: '',
    percentage: '',
    product_targeting_expression: ''
}

/*
 For bulk sponsored Products campaigns
 Refer to amazon adds documentation here : https://advertising.amazon.com/API/docs/en-us/bulksheets/2-0/create-sp-campaign
 Author : Usama Abdur Rehman <hafizusama43@gmail.com>
*/

const Products = () => {
    const params = useParams<{ slug: string }>();
    const { currentStep, campaignData, targetingType, biddingData, skus } = useCampaignsStore()
    const [pendingSave, setPendingSave] = useState(false);

    const handleSaveChanges = async () => {
        setPendingSave(true);
        // setTimeout(() => {
        //     setPendingSave(false)
        //     toast({ description: 'Changes saved successfully!' })
        // }, 3000);
        try {
            const res = await axios.post('/api/campaigns/campaign-data',
                { campaignData, targetingType, biddingData, skus, slug: params.slug },
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );
            setPendingSave(false);
        } catch (error) {
            setPendingSave(false);
        }
    }

    useEffect(() => {
        console.log(campaignData)
    }, [campaignData, currentStep])

    return (
        <React.Fragment>
            <TemplateHeader>
                <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
                <div className='flex gap-2'>
                    {/* <Button size='sm'>Save changes</Button> */}
                    {/* <Link href={`/campa/${params.slug}/create-campaign`}><Button size='sm'>Create campaign</Button></Link> */}
                    <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button>
                </div>
            </TemplateHeader>
            <div className='border border-gray-300 p-5 rounded-lg'>
                <strong><h5>{currentStep && currentStep === 5 && targetingType.toLocaleLowerCase() === "auto" ? "Product Targeting" : STEPS[currentStep]}</h5></strong>
                <Separator className='mt-3 mb-3'></Separator>
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
                {currentStep === 5 && <Step5 />}
            </div>
        </React.Fragment>
    )
}

export default Products