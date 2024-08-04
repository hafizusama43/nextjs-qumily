"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { AlertTriangle, CheckCircle2Icon, CircleArrowLeft, SaveIcon } from 'lucide-react'
import { getSpecificKeyValues, getStepName, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { useCampaignsStore } from '@/hooks/useSponseedProductsStore'
import { initialState } from './products'
import { RenderTextArea } from '../_renderTextInput'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { useParams, useSearchParams } from 'next/navigation'
import { Spin } from '@/components/ui/spin'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import CustomAlert from '@/components/ui/CustomAlert'

const FormSchema = z.object({
    product_targeting_expression: z.string().optional(),
});


const NegProductTargeting = ({ steps }) => {
    const params = useParams<{ slug: string }>();
    const searchParams = useSearchParams()
    const category = searchParams.get('category')
    const [changesSaved, setChangesSaved] = useState(false)
    const { campaignData,
        setCampaignData,
        currentStep,
        setPrevStep,
        setProductTargetingExpression,
        productTargetingExpression,
        setPendingSave,
        negKeywordData,
        campaignNegKeywordData,
        targetingType,
        biddingData,
        skus,
        pendingSave,
        campaignProductsCount,
        targetingStrategy,
        productTargetingData
    } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product_targeting_expression: '',
        },
    })

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        form.setValue("product_targeting_expression", productTargetingExpression);
    }, [currentStep, form, productTargetingExpression, steps])

    const onSubmit = async (data) => {
        var entity: string = getStepName(steps[currentStep]);
        if (data.product_targeting_expression) {
            setProductTargetingExpression(data.product_targeting_expression)

            // Get existing campaign object to retain values in next object
            var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
            const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id', 'state']);
            var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());
            if (objExists.length > 0) {
                console.info(`Object "${entity}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['product_targeting_expression']: '%product_targeting_expression%',
                };
                const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                setCampaignData(arr)
            } else {
                console.info(`Object "${entity}" not found : Creating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['product_targeting_expression']: '%product_targeting_expression%',
                };
                campaignData.push(updatedObj);
                setCampaignData(campaignData);
            }
        } else {
            var entityObjIndex = campaignData.findIndex((item) => item.entity.toLowerCase() === entity.toLowerCase());
            if (entityObjIndex !== -1) {
                campaignData.splice(entityObjIndex, 1);
                setCampaignData(campaignData);
            }
        }

        setPendingSave(true);
        try {
            await axios.post('/api/campaigns/campaign-data',
                {
                    campaignData, targetingType,
                    biddingData,
                    skus,
                    slug: params.slug,
                    negKeywordData,
                    campaignNegKeywordData,
                    productTargetingExpression: data.product_targeting_expression,
                    campaignProductsCount,
                    targetingStrategy,
                    productTargetingData
                },
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );
            toast({ description: 'Changes saved successfully!' })
            setPendingSave(false);
            setChangesSaved(true)
        } catch (error) {
            setPendingSave(false);
            console.log(error)
        }
    }

    return (
        <div>
            <CustomAlert iconName={"triangle-alert"} title='Heads up!' variant='info' description={'You can add <b>multiples product targeting expression&apos;s</b> at once, <b>after adding an targeting expression press enter to go to next line</b> and then repeat same for multiple, either they should be comma separated <b>eg. asin1 asin2 asin3....</b> they should be separated by space eg. <b>asin1 asin2 asin3....</b>.'}></CustomAlert>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="w-full">
                        <RenderTextArea name={"product_targeting_expression"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderTextArea>
                    </div>
                    {changesSaved &&
                        <CustomAlert iconName={"triangle-alert"} title='Campaign updated!' variant='success' description={"Campaign changes saved successfully. Click <Link target='_blank' href={`/campaigns/${params.slug}?category=${category}`}><b className='hover:underline'>here</b></Link> to view the campaign."}></CustomAlert>
                    }
                    <div className='flex justify-end gap-4 mt-5'>
                        <Button type="button" disabled={currentStep < 2 || pendingSave} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                        <Button type="submit" disabled={pendingSave}>{pendingSave ? <Spin variant="light" size="sm"></Spin> : <SaveIcon />} &nbsp; Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NegProductTargeting