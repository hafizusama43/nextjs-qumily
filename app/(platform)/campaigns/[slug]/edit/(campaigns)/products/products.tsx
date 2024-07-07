"use client"
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'
import Step2 from './_step2'
import Step3 from './_step3'
import Step4 from './_step4'
import Step5 from './_step5'
import { STEPS } from '@/lib/helpers'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'


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
    ad_group_default_bid: '',
    bid: '',
    keyword_text: '',
    match_type: '',
    bidding_strategy: '',
    placement: '',
    percentage: '',
    product_targeting_expression: ''
}

/*
 For sponsered Products campaigns
 Refer to amazon adds documentation here : https://advertising.amazon.com/API/docs/en-us/bulksheets/2-0/create-sp-campaign
 Author : Usama Abdur Rehman <hafizusama43@gmail.com>
*/

const Products = () => {
    const { currentStep, campaignData } = useCampaignsStore()

    useEffect(() => {
        console.log(campaignData)
    }, [currentStep])


    return (
        <div className='border border-gray-300 p-5 rounded-lg'>
            <strong><h5>{STEPS[currentStep]}</h5></strong>
            <Separator className='mt-3 mb-3'></Separator>
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
            {currentStep === 4 && <Step4 />}
            {currentStep === 5 && <Step5 />}
        </div>
    )
}

export default Products