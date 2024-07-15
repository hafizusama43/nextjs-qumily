"use client"
import { Button } from '@/components/ui/button'
import React, { useCallback } from 'react'
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

const FormSchema = z.object({
    product_targeting_expression: z.string().optional(),
});


const NegProductTargeting = ({ steps }) => {
    const { campaignData,
        setCampaignData,
        setNextStep,
        currentStep,
        setPrevStep,
        setProductTargetingExpression,
        productTargetingExpression
    } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product_targeting_expression: '',
        },
    })

    const onSubmit = (data) => {
        if (data.product_targeting_expression) {
            var entity: string = getStepName(steps[currentStep]);
            // Get existing campaign object to retain values in next object
            var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
            const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id', 'state']);
            var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());
            console.log(objExists)
            if (objExists.length > 0) {
                console.info(`Object "${entity}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['product_targeting_expression']: '%product_targeting_expression%',
                };
                console.log(updatedObj)
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
    }

    const handleSaveChanges = useCallback(() => {
        console.log(productTargetingExpression);
        // Bidding adjustments is optional if not added any then skip 
        // if (negKeywordData.length > 0) {
        //     var entity: string = getStepName(steps[currentStep]);
        //     // Get existing campaign object to retain values in next object
        //     var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
        //     const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id', 'state']);
        //     var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());

        //     console.log(objExists)
        //     if (objExists.length > 0) {
        //         console.info(`Object "${entity}" found : Updating`)
        //         const updatedObj = {
        //             ...initialState,
        //             ...adGroupObjValues,
        //             'entity': entity,
        //             ['keyword_text']: '%keyword_text%',
        //             ['match_type']: '%match_type%',
        //         };
        //         console.log(updatedObj)
        //         const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
        //         setCampaignData(arr)
        //     } else {
        //         console.info(`Object "${entity}" not found : Creating`)
        //         const updatedObj = {
        //             ...initialState,
        //             ...adGroupObjValues,
        //             'entity': entity,
        //             ['keyword_text']: '%keyword_text%',
        //             ['match_type']: '%match_type%',
        //         };
        //         campaignData.push(updatedObj);
        //         setCampaignData(campaignData);
        //     }
        // }
    }, [productTargetingExpression])

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="w-full">
                        <RenderTextArea name={"product_targeting_expression"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderTextArea>
                    </div>
                    <Separator className='mt-10 mb-3'></Separator>
                    <div className='flex justify-end gap-4 mt-5'>
                        <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                        <Button type="submit"><SaveIcon /> &nbsp; Save changes</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NegProductTargeting