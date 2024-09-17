"use client"
import React, { useEffect, useState } from 'react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AD_FORMAT_TYPE, BID_OPTIMIZATION_TYPE, BIDDING_STRATEGY, BUDGET_TYPE, CAMPAIGN_STATE, getSpecificKeyValues, getStepName, SBC_HELP_TEXT, SPONSORED_BRANDS_CAMPAIGNS, TARGETING_STRATEGY, TARGETING_TYPE } from '@/lib/helpers'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { RenderInput } from '../_renderInput'
import { RenderDatePicker } from '../_renderDatePicker'
import { RenderSelect } from '../_renderSelect'
import { useCampaignsStore } from '@/hooks/useSponsoredBrandsStore'
import { initialState } from './brands'

const FormSchema = z.object({
    product: z.string().min(1, { message: "Product is required" }).default('Sponsored Products'),
    entity: z.string().min(1, { message: "Entity is required" }).default('Campaign'),
    operation: z.string().min(1, { message: "Operation is required" }).default('Create'),
    campaign_id: z.string().min(1, { message: "Campaign ID is required" }).default('Campaign Id'),
    campaign_name: z.string().min(1, { message: "Campaign Name is required" }).default('Campaign Name'),
    start_date: z.date().default(new Date()).refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: 'Start date must be a valid date',
    }),
    end_date: z.date().default(new Date()).refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: 'End date must be a valid date',
    }).nullable(),
    state: z.string().min(1, { message: "State is required" }).default('Enabled'),
    budget_type: z.string().min(1, { message: "Budget type is required" }),
    budget: z.coerce.number().min(1, 'Budget must be greater then 0'),
    bid_optimization: z.string().min(1, { message: "Bid optimization is required" }),
    bid_multiplier: z.coerce.number(),
    ad_format: z.string().min(1, { message: "Ad format is required" }),
    landing_page_url: z.string().min(1, { message: "landing page url is required" }),
    brand_entity_id: z.string().min(1, { message: "Brand entity id is required" }),
    brand_name: z.string().min(1, { message: "Brand Name is required" }),
    brand_logo_asset_id: z.string(),
    brand_logo_url: z.string(),
    creative_headline: z.string(),
    creative_asins: z.string(),
    video_media_ids: z.string(),
    creative_type: z.string(),
    targeting_strategy: z.string().min(1, { message: "Targeting strategy is required" }).default('keyword'),
}).superRefine((values, context) => {
    if (values.bid_optimization === "manual") {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bid multiplier is required",
            path: ["bid_multiplier"],
        });
    }
});




type FormSchemaType = z.infer<typeof FormSchema>;


const Campaign = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, setPrevStep, currentStep, setTargetingStrategy, targetingStrategy } = useCampaignsStore()
    const [isReady, setIsReady] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product: 'Sponsored Brands',
            entity: 'Campaign',
            operation: 'Create',
            campaign_id: '',
            campaign_name: '',
            start_date: new Date(),
            end_date: null,
            state: '',
            budget_type: '',
            budget: 10,
            bid_optimization: '',
            bid_multiplier: 0,
            ad_format: '',
            landing_page_url: '',
            brand_entity_id: '',
            brand_name: '',
            brand_logo_asset_id: '',
            brand_logo_url: '',
            creative_headline: '',
            creative_asins: '',
            video_media_ids: '',
            creative_type: '',
            targeting_strategy: ''
        },
    })

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        var campaignObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
        if (campaignObjExists.length > 0) {
            const campaignObjValues = getSpecificKeyValues(campaignObjExists[0], [
                'product', 'campaign_id', 'campaign_name', 'start_date', 'end_date', 'state',
                'budget_type', 'budget', 'bid_optimization', 'bid_multiplier', 'ad_format', 'landing_page_url', 'brand_entity_id', 'brand_name',
                'brand_logo_asset_id', 'brand_logo_url', 'creative_headline', 'creative_asins', 'video_media_ids', 'creative_type', 'targeting_strategy'
            ]);
            Object.entries(campaignObjValues).forEach(([key, value]) => {
                // Need to format dates into new Date() when setting for form from store.
                if ((key === 'start_date' || key === 'end_date') && value) {
                    value = new Date(value as string);
                }
                form.setValue(key as keyof FormSchemaType, value as any);
            });
            form.setValue('targeting_strategy', targetingStrategy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {

        console.log(data)
        var entity: string = getStepName(steps[currentStep]);
        setTargetingStrategy(data.targeting_strategy);
        delete data.targeting_strategy;
        var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
        if (objExists.length > 0) {
            console.info(`Object "${entity}" found : Updating`)
            const updatedObj = {
                ...objExists[0],
                ...data
            };
            const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
            setCampaignData(arr)
        } else {
            console.info(`Object "${entity}" not found : Creating`)
            const updatedObj = {
                ...initialState,
                ...data
            };
            campaignData.push(updatedObj);
            setCampaignData(campaignData);
        }
        setNextStep();
    }


    useEffect(() => {
        // Trigger re-render when form values are set to populate dropdowns
        setIsReady(true);
    }, []);
    if (!isReady) return null;

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"product"} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.product}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"entity"} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.entity}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"operation"} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.operation}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"campaign_id"} helpText={SBC_HELP_TEXT.campaign_id} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.campaign_id}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"campaign_name"} helpText={SBC_HELP_TEXT.campaign_name} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.campaign_name}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderDatePicker name={"start_date"} helpText={SBC_HELP_TEXT.start_date} label={SPONSORED_BRANDS_CAMPAIGNS.start_date} form={form}></RenderDatePicker>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderDatePicker disabled name={"end_date"} label={SPONSORED_BRANDS_CAMPAIGNS.end_date} form={form}></RenderDatePicker>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"state"} helpText={SBC_HELP_TEXT.state} form={form} options={CAMPAIGN_STATE} label={SPONSORED_BRANDS_CAMPAIGNS.state}></RenderSelect>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"budget_type"} helpText={SBC_HELP_TEXT.budget_type} form={form} options={BUDGET_TYPE} label={SPONSORED_BRANDS_CAMPAIGNS.budget_type}></RenderSelect>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"budget"} helpText={SBC_HELP_TEXT.budget} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.budget} type={"number"}></RenderInput>
                        </div>
                    </div>


                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"bid_optimization"} helpText={SBC_HELP_TEXT.bid_optimization} form={form} options={BID_OPTIMIZATION_TYPE} label={SPONSORED_BRANDS_CAMPAIGNS.bid_optimization}></RenderSelect>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"bid_multiplier"} helpText={SBC_HELP_TEXT.bid_multiplier} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.bid_multiplier} type={"number"}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"ad_format"} helpText={SBC_HELP_TEXT.ad_format} form={form} options={AD_FORMAT_TYPE} label={SPONSORED_BRANDS_CAMPAIGNS.ad_format}></RenderSelect>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"landing_page_url"} helpText={SBC_HELP_TEXT.landing_page_url} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.landing_page_url}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"brand_entity_id"} helpText={SBC_HELP_TEXT.brand_entity_id} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.brand_entity_id}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"brand_name"} helpText={SBC_HELP_TEXT.brand_name} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.brand_name}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"brand_logo_asset_id"} helpText={SBC_HELP_TEXT.brand_logo_asset_id} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.brand_logo_asset_id}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"brand_logo_url"} helpText={SBC_HELP_TEXT.brand_logo_url} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.brand_logo_url}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"creative_headline"} helpText={SBC_HELP_TEXT.creative_headline} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.creative_headline}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"creative_asins"} helpText={SBC_HELP_TEXT.creative_asins} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.creative_asins}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"video_media_ids"} helpText={SBC_HELP_TEXT.brand_logo_url} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.video_media_ids}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"creative_type"} helpText={SBC_HELP_TEXT.creative_type} form={form} label={SPONSORED_BRANDS_CAMPAIGNS.creative_type}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"targeting_strategy"} form={form} options={TARGETING_STRATEGY} label={'Targeting Strategy'}></RenderSelect>
                        </div>
                    </div>
                    <Separator className='my-3'></Separator>
                    <div className='flex justify-end gap-4 mt-10'>
                        <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                        <Button disabled={currentStep >= 5 || !isReady}>{currentStep < 5 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}


export default Campaign