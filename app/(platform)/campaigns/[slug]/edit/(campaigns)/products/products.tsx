"use client"
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'
import Step2 from './_step2'
import Step3 from './_step3'
import Step4 from './_step4'
import Step5 from './_step5'
import { capitalizeFirstLetter, GET_STEPS } from '@/lib/helpers'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import TemplateHeader from '@/components/ui/_header'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Spin } from '@/components/ui/spin'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Skeleton } from '@/components/ui/Skeleton'


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
    const { currentStep, campaignData, targetingType, biddingData, skus, setCampaignData, setTargetingType, setBiddingData, setSkus } = useCampaignsStore()
    const [pendingSave, setPendingSave] = useState(false);
    const [pending, setPending] = useState(false);
    const STEPS = GET_STEPS(targetingType);


    const getCampaignData = useCallback(async () => {
        try {
            setPending(true)
            const res = await axios.get(`/api/campaigns/campaign-data?slug=${params.slug}`);
            if (res.data.success) {
                const { campaign_template_data, campaign_data } = res.data.data
                setCampaignData(campaign_template_data);
                campaign_data.targeting_type && setTargetingType(campaign_data.targeting_type);
                campaign_data.bidding_data && setBiddingData(campaign_data.bidding_data);
                campaign_data.skus && setSkus(campaign_data.skus);
            }
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }, [params.slug, setBiddingData, setCampaignData, setSkus, setTargetingType])

    useEffect(() => {
        // Get campaign template and campaign data
        getCampaignData()
    }, [getCampaignData])

    const handleSaveChanges = async () => {
        setPendingSave(true);
        try {
            await axios.post('/api/campaigns/campaign-data',
                { campaignData, targetingType, biddingData, skus, slug: params.slug },
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );
            toast({ description: 'Changes saved successfully!' })
            setPendingSave(false);
        } catch (error) {
            setPendingSave(false);
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <TemplateHeader>
                <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; campaign</Label>
                <div className='flex gap-2'>
                    <Button disabled={pendingSave || pending} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button>
                </div>
            </TemplateHeader>
            {pending ?
                <Skeleton className="h-[400px] w-[100%] rounded-xl" /> :
                <div className='border border-gray-300 p-5 rounded-lg'>
                    <strong><h5>{currentStep && currentStep === 5 && targetingType.toLocaleLowerCase() === "auto" ? "Product Targeting" : STEPS[currentStep]}</h5></strong>
                    <Separator className='mt-3 mb-3'></Separator>
                    {currentStep === 1 && <Step1 steps={STEPS} />}
                    {currentStep === 2 && <Step2 steps={STEPS} />}
                    {currentStep === 3 && <Step3 steps={STEPS} />}
                    {currentStep === 4 && <Step4 steps={STEPS} />}
                    {currentStep === 5 && <Step5 steps={STEPS} />}
                </div>}
        </React.Fragment>
    )
}

export default Products