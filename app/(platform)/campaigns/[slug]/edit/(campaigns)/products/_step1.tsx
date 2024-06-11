"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { BIDDING_STRATEGY, CAMPAIGN_STATE, SPONSORED_PRODUCTS_CAMPAIGNS, TARGETING_TYPE, TEMPLATE_CATEGORY } from '@/lib/helpers'
import { Calendar } from '@/components/ui/calender'
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { Separator } from '@/components/ui/separator'

const FormSchema = z.object({
    product: z.string(),
    entity: z.string(),
    operation: z.string(),
    campaign_id: z.string(),
    ad_group_id: z.string(),
    portfolio_id: z.string(),
    ad_id: z.string(),
    keyword_id: z.string(),
    product_targeting_id: z.string(),
    ad_group_name: z.string(),
    campaign_name: z.string(),
    start_date: z.date(),
    end_date: z.date(),
    targeting_type: z.string(),
    state: z.string(),
    daily_budget: z.number(),
    sku: z.string(),
    ad_group_default_bid: z.string(),
    bid: z.string(),
    keyword_text: z.string(),
    match_type: z.string(),
    bidding_strategy: z.string(),
    placement: z.string(),
    percentage: z.string(),
    product_targeting_expression: z.string(),
});


const Step1 = ({ step, STEPS, handlePrevStep, handleNextStep }) => {
    const [pending, setPending] = useState(false);
    // const [createdRow, setCreatedRow] = useState<createdRowType>();
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

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)

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
                        <Button disabled={step < 2} onClick={handlePrevStep}>Previous {step > 1 && "=> " + STEPS[step - 1]}</Button>
                        <Button disabled={step >= 5}>Next {step < 5 && "=> " + STEPS[step + 1]}</Button>
                    </div>
                </form>
            </Form>
        </div >
    )
}

const RenderInput = ({ form, name, label, disabled = false, type = "text" }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type={type === 'number' ? "number" : "text"} disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

const RenderDatePicker = ({ form, name, label }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-10  pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

const RenderSelect = ({ form, name, label, options }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a campaign category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {/* <SelectItem value="none">None</SelectItem> */}
                            {Object.keys(options).map((item, index) => <SelectItem
                                key={index}
                                value={item}>
                                {options[item]}
                            </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default Step1