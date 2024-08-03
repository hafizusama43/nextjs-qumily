"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, X } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { getSpecificKeyValues, getStepName, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCampaignsStore } from '@/hooks/useSponseedProductsStore'
import { initialState } from './products'
import { RenderTextArea } from '../_renderTextInput'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FormSchema = z.object({
    sku: z.string().min(1, { message: "Products SKU'S are required" }),
    campaign_products_count: z.coerce.number().min(0, { message: "Must be a positive number." }).default(0),
});

const ProductAd = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setSkus, skus, setCampaignProductCount, campaignProductsCount } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sku: '',
            campaign_products_count: 0
        },
    })

    const skusVal = form.watch('sku');

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        form.setValue("sku", skus);
        form.setValue("campaign_products_count", campaignProductsCount);
    }, [campaignProductsCount, currentStep, form, skus, steps])

    const onSubmit = (data) => {
        setSkus(data.sku);
        setCampaignProductCount(data.campaign_products_count)

        var entity: string = getStepName(steps[currentStep]);
        // Get existing campaign object to retain values in next object
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
                'entity': entity,
                'sku': '%sku%'
            };
            campaignData.push(updatedObj);
            setCampaignData(campaignData);
        }
        setNextStep();
    }

    // const handleRemoveProduct = (item: string, separator: string) => {
    //     console.log(separator)
    //     console.log(item)
    // }

    const printNumberedProducts = () => {
        var splitArr = []
        var separator = '';
        if (form.getValues('sku').includes(",")) {
            separator = ","
            splitArr = form.getValues('sku').split(',')
        } else if (form.getValues('sku').includes("\n")) {
            separator = "\n"
            splitArr = form.getValues('sku').split('\n')
        } else {
            splitArr = form.getValues('sku').split(" ")
        }
        return splitArr.map((item, index) => {
            return (
                item && <Badge key={index} className="mr-2 mb-1" variant="outline">{item} <Separator orientation="vertical" />
                    {/* <X onClick={() => { handleRemoveProduct(item, separator) }} className='ml-1' role="button" size={16} strokeWidth={0.5}></X> */}
                </Badge>
            )
        })
    }

    return (
        <div>
            <Alert className="my-5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add <b>multiples SKU&apos;S</b> at once, <b>after adding an SKU press enter to go to next line</b> and then repeat same for all SKU&pos;s either they should be comma separated <b>eg. sku1, sku2, sku2....</b> they should be separated by space eg. <b>sku1 sku2 sku2....</b>.
                </AlertDescription>
            </Alert>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className='flex gap-3'>
                        <div className='w-1/2'>
                            <RenderTextArea name={"sku"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.sku}></RenderTextArea>
                        </div>
                        <div className='w-1/2'>
                            <Card className='mt-8'>
                                <CardHeader >
                                    <CardDescription>Product SKU&apos;s.</CardDescription>
                                    <CardContent className='p-0'>
                                        {form.getValues('sku') ? printNumberedProducts() : <small>Please add SKU&apos;S in the textarea.</small>}
                                    </CardContent>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                    <div className='w-1/2'>
                        <RenderInput disabled={!skusVal || skusVal === ''} name={"campaign_products_count"} form={form} label={'Products to add in each campaign'} type={"number"}></RenderInput>
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