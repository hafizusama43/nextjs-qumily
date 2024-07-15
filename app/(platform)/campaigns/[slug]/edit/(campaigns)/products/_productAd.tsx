"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bigint, z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, Trash2 } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { getSpecificKeyValues, PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { initialState } from './products'
import loadJsConfig from 'next/dist/build/load-jsconfig'
import { Kablammo } from 'next/font/google'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'

const FormSchema = z.object({
    sku: z.string().min(1, { message: "Products SKU'S are required" }),
});

const ProductAd = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setSkus, skus } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sku: '',
        },
    })

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        form.setValue("sku", skus);
    }, [currentStep, form, skus, steps])

    const onSubmit = (data) => {
        setSkus(data.sku);

        var entity: string = steps[currentStep];
        entity = entity.replace('(Required)', '');
        entity = entity.trim()

        // Get existsing campaign object to retain values in next object
        var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
        const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'campaign_id', 'ad_group_id', 'state']);
        var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "product ad");

        if (objExists.length > 0) {
            console.info(`Object "${entity}" found : Updating`)
            const updatedObj = {
                ...initialState,
                ...adGroupObjValues,
                'entity': entity,
                'sku': '%sku%'
            };
            const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
            setCampaignData(arr)
        } else {
            console.info(`Object "${entity}" not found : Creating`)
            const updatedObj = {
                ...initialState,
                ...adGroupObjValues,
                'entity': steps[currentStep],
                'sku': '%sku%'
            };
            campaignData.push(updatedObj);
            setCampaignData(campaignData);
        }
        setNextStep();
    }

    return (
        <div>
            <Alert className="my-5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add <b>multiples SKU&apos;S</b> at once, either they should be comma seperated <b>eg. sku1, sku2, sku2....</b> or they should be seperated by space eg. <b>sku1 sku2 sku2....</b>.
                </AlertDescription>
            </Alert>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className='w-full'>
                        <RenderTextArea name={"sku"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.sku}></RenderTextArea>
                    </div>

                    <Separator className='mt-5'></Separator>
                    <div className='flex justify-end gap-4 mt-5'>
                        <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                        <Button disabled={currentStep >= 5}>{currentStep < 5 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProductAd