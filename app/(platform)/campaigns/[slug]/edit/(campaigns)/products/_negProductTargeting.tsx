"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CircleArrowLeft, CircleArrowRight, SaveIcon, Trash2 } from 'lucide-react'
import { getSpecificKeyValues, getStepName, MATCH_TYPE, PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { useParams } from 'next/navigation'
import { Spin } from '@/components/ui/spin'

const FormSchema = z.object({
    product_targeting_expression: z.string().optional(),
});


const NegProductTargeting = ({ steps }) => {
    const params = useParams<{ slug: string }>();
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
        campaignProductsCount
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
        if (data.product_targeting_expression) {
            setProductTargetingExpression(data.product_targeting_expression)
            var entity: string = getStepName(steps[currentStep]);
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
        }

        setPendingSave(true);
        try {
            console.log(JSON.stringify(campaignData))
            await axios.post('/api/campaigns/campaign-data',
                { campaignData, targetingType, biddingData, skus, slug: params.slug, negKeywordData, campaignNegKeywordData, productTargetingExpression: data.product_targeting_expression, campaignProductsCount },
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
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="w-full">
                        <RenderTextArea name={"product_targeting_expression"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderTextArea>
                    </div>
                    <Separator className='mt-10 mb-3'></Separator>
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