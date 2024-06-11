"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React, { useCallback, useEffect, useState } from 'react'
import Step1 from './_step1'
import Step2 from './_step2'
import Step3 from './_step3'
import Step4 from './_step4'
import Step5 from './_step5'

const STEPS = {
    1: "Campaign",
    2: "Bidding Adjustment",
    3: "Ad Group",
    4: "Product Ad",
    5: "Keywords",
}

const initialState = {
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
    placement: [],
    percentage: [],
    product_targeting_expression: ''
}
interface InitialState {
    product: string;
    entity: string;
    operation: string;
    campaign_id: string;
    ad_group_id: string;
    portfolio_id: string;
    ad_id: string;
    keyword_id: string;
    product_targeting_id: string;
    campaign_name: string;
    ad_group_name: string;
    start_date: string;
    end_date: string;
    targeting_type: string;
    state: string;
    daily_budget: number;
    sku: string;
    ad_group_default_bid: string;
    bid: string;
    keyword_text: string;
    match_type: string;
    bidding_strategy: string;
    placement: any[];
    percentage: any[];
    product_targeting_expression: string;
}


const Products = () => {
    const [step, setStep] = useState(1)
    const [campaignData, setCampaignData] = useState<InitialState[]>([])

    const handleNextStep = useCallback((data: any, currStepName: string) => {
        if (step < 5) {
            switch (currStepName) {
                case 'campaign':
                    console.log('Current step : ', currStepName)
                    var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
                    console.log(objExists)
                    if (objExists.length > 0) {
                        console.log('Object found : Updating')
                        const updatedObj = {
                            ...objExists[0],
                            ...data
                        };
                        setCampaignData(prevData =>
                            prevData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                        );
                    } else {
                        console.log('Object not found : Creating')
                        const updatedObj = {
                            ...initialState,
                            ...data
                        };
                        setCampaignData(prevData => [...prevData, updatedObj]);
                    }
                    break;
                case 'bidding-adjustment':
                    // Get existsing campaign object to retain values in next object
                    var campaignObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
                    const specificValues = getSpecificKeyValues(campaignObjExists[0], ['product', 'operation', 'campaign_id', 'state']);

                    const { placementArray, percentageArray } = transformObject(data);

                    var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "bidding adjustment");
                    if (objExists.length > 0) {
                        console.log('Object found Bidding Adjustment : Updating')
                        const updatedObj = {
                            ...initialState,
                            ...specificValues,
                            'entity': STEPS[step],
                            ['placement']: placementArray,
                            ['percentage']: percentageArray
                        };
                        setCampaignData(prevData =>
                            prevData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                        );
                    } else {
                        console.log('Object not found Bidding Adjustment : Creating')
                        const updatedObj = {
                            ...initialState,
                            ...specificValues,
                            'entity': STEPS[step],
                            ['placement']: placementArray,
                            ['percentage']: percentageArray
                        };
                        setCampaignData(prevData => [...prevData, updatedObj]);
                    }
                    break;
                case 'ad-group':

                    break;
                case 'product-ad':

                    break;
                case 'keywords':

                    break;
                default:
                    break;
            }
            setStep(step + 1)
        }
    }, [campaignData, step])

    useEffect(() => {
        console.log(campaignData)
    }, [campaignData])


    const handlePrevStep = useCallback(() => {
        if (step > 1) {
            setStep(step - 1)
        }
    }, [step])

    // Transform array of object into seprate arrays of objects
    const transformObject = (input) => {
        if (Array.isArray(input)) {
            const placementArray = [];
            const percentageArray = [];

            input.forEach(({ id, placement, percentage }) => {
                placementArray.push({ [`"${id.toString()}"`]: placement });
                percentageArray.push({ [`"${id.toString()}"`]: percentage });
            });

            return { placementArray, percentageArray };
        }
    };

    // Function to fetch specific key values from an object
    const getSpecificKeyValues = (obj, keys) => {
        const result = {};
        keys.forEach(key => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });
        return result;
    };


    return (
        <div className='border border-gray-300 p-5 rounded-lg'>
            <strong><h5>{STEPS[step]}</h5></strong>
            <Separator className='mt-3 mb-3'></Separator>
            {step === 1 && <Step1 campaignData={campaignData} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step1>}
            {step === 2 && <Step2 campaignData={campaignData} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step2>}
            {step === 3 && <Step3 campaignData={campaignData} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step3>}
            {step === 4 && <Step4 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step4>}
            {step === 5 && <Step5 handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} step={step} STEPS={STEPS}></Step5>}
        </div>
    )
}

export default Products