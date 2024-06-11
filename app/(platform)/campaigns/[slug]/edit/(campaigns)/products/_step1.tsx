"use client"
import React, { useEffect } from 'react'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BIDDING_STRATEGY, CAMPAIGN_STATE, SPONSORED_PRODUCTS_CAMPAIGNS, TARGETING_TYPE } from '@/lib/helpers'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { RenderInput } from '../_renderInput'
import { RenderDatePicker } from '../_renderDatePicker'
import { RenderSelect } from '../_renderSelect'

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
    }),
    targeting_type: z.string().min(1, { message: "Targeting Type is required" }).default('Auto'),
    state: z.string().min(1, { message: "State is required" }).default('Enabled'),
    daily_budget: z.coerce.number().min(1, 'Daily Budget must be greater then 0').default(10),
    bidding_strategy: z.string().min(1, { message: "Bidding Strategy is required" }).default('Fixed bid'),
});


const Step1 = ({ step, STEPS, handlePrevStep, handleNextStep, campaignData }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product: 'Sponsored Products',
            entity: 'Campaign',
            operation: 'Create',
            campaign_id: 'Campaign Id',
            campaign_name: 'Campaign Name',
            start_date: new Date(),
            end_date: new Date(),
            targeting_type: 'Auto',
            state: 'Enabled',
            daily_budget: 10,
            bidding_strategy: 'Fixed bid',
        },
    })

    useEffect(() => {
        console.log(campaignData)
    }, [campaignData])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        handleNextStep(data, 'campaign')
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"product"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"entity"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.entity}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput disabled name={"operation"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.operation}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"campaign_id"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.campaign_id}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"campaign_name"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.campaign_name}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderDatePicker name={"start_date"} label={SPONSORED_PRODUCTS_CAMPAIGNS.start_date} form={form}></RenderDatePicker>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderDatePicker name={"end_date"} label={SPONSORED_PRODUCTS_CAMPAIGNS.end_date} form={form}></RenderDatePicker>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"targeting_type"} form={form} options={TARGETING_TYPE} label={SPONSORED_PRODUCTS_CAMPAIGNS.targeting_type}></RenderSelect>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"state"} form={form} options={CAMPAIGN_STATE} label={SPONSORED_PRODUCTS_CAMPAIGNS.state}></RenderSelect>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"daily_budget"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.daily_budget} type={"number"}></RenderInput>
                        </div>
                    </div>

                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <RenderSelect name={"bidding_strategy"} form={form} options={BIDDING_STRATEGY} label={SPONSORED_PRODUCTS_CAMPAIGNS.bidding_strategy}></RenderSelect>
                        </div>
                    </div>
                    <Separator className='my-3'></Separator>
                    <div className='flex justify-end gap-4 mt-10'>
                        <Button type="button" disabled={step < 2} onClick={handlePrevStep}><CircleArrowLeft /> &nbsp; {step > 1 && STEPS[step - 1]}</Button>
                        <Button disabled={step >= 5}>{step < 5 && STEPS[step + 1]} &nbsp; <CircleArrowRight /></Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}


export default Step1