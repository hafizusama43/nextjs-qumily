import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { BIDDING_STRATEGY, CAMPAIGN_STATE, getSpecificKeyValues, SPONSORED_PRODUCTS_CAMPAIGNS, TARGETING_TYPE } from '@/lib/helpers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RenderInput } from '../_renderInput'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'
import { Form } from '@/components/ui/form'
import { initialState } from './products'

const FormSchema = z.object({
    ad_group_id: z.string().min(1, { message: "Ad group id is required" }),
    ad_group_name: z.string().min(1, { message: "Ad group name is required" }),
    ad_group_default_bid: z.coerce.number().min(1, 'Ad group default bid must be greater then 0'),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Step3 = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ad_group_id: '',
            ad_group_name: '',
            ad_group_default_bid: 0,
        },
    })

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
        if (adGroupObjExists.length > 0) {
            const campaignObjValues = getSpecificKeyValues(adGroupObjExists[0], ['ad_group_id', 'ad_group_name', 'ad_group_default_bid']);
            Object.entries(campaignObjValues).forEach(([key, value]) => {
                form.setValue(key as keyof FormSchemaType, value as any);
            });
        }
    }, [campaignData, currentStep, form, steps])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        var campaignObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
        const campaignObjValues = getSpecificKeyValues(campaignObjExists[0], ['product', 'operation', 'campaign_id', 'state']);
        var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");

        if (objExists.length > 0) {
            console.info(`Object "${steps[currentStep]}" found : Updating`)
            const updatedObj = {
                ...initialState,
                ...campaignObjValues,
                'entity': steps[currentStep],
                ...data
            };
            const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
            setCampaignData(arr)
        } else {
            console.info(`Object "${steps[currentStep]}" not found : Creating`)
            const updatedObj = {
                ...initialState,
                ...campaignObjValues,
                'entity': steps[currentStep],
                ...data
            };
            campaignData.push(updatedObj);
            setCampaignData(campaignData);
        }
        setNextStep();
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"ad_group_id"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.ad_group_id}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"ad_group_name"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.ad_group_name}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"ad_group_default_bid"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.ad_group_default_bid} type={"number"}></RenderInput>
                        </div>
                    </div>
                    <Separator className='my-3'></Separator>
                    <div className='flex justify-end gap-4 mt-10'>
                        <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                        <Button disabled={currentStep >= 5}>{currentStep < 5 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}

export default Step3