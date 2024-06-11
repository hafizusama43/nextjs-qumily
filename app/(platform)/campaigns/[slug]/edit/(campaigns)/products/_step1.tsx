"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { SPONSORED_PRODUCTS_CAMPAIGNS, TEMPLATE_CATEGORY } from '@/lib/helpers'
import { Calendar } from '@/components/ui/calender'
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

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
    daily_budget: z.string(),
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
            ad_group_id: 'Ad Group Id',
            portfolio_id: 'Portfolio Id',
            ad_id: 'Ad Id',
            keyword_id: 'Keyword Id',
            product_targeting_id: 'Product Targeting Id',
            campaign_name: 'Campaign Name',
            ad_group_name: 'Ad Group Name',
            start_date: new Date(),
            end_date: new Date(),
            targeting_type: 'Targeting Type',
            state: 'State',
            daily_budget: 'Daily Budget',
            sku: 'SKU',
            ad_group_default_bid: 'Ad Group Default Bid',
            bid: 'Bid',
            keyword_text: 'Keyword Text',
            match_type: 'Match Type',
            bidding_strategy: 'Bidding Strategy',
            placement: 'Placement',
            percentage: 'Percentage',
            product_targeting_expression: 'Product Targeting Expression'
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        // try {
        //     setPending(true)
        //     const res = await axios.post('/api/campaigns/create', { ...data });
        //     // if (res.data.success) {
        //     //     setCreatedRow(res.data.data[0])
        //     // }
        //     form.reset()
        //     toast({ description: res.data.message })
        //     setPending(false)
        // } catch (error) {
        //     setPending(false)
        //     toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        // }
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
                            <RenderInput name={"entity"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.entity}></RenderInput>
                        </div>
                        <div className='basis-1/2 w-full'>
                            <RenderInput name={"operation"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.operation}></RenderInput>
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

                    <div className='flex justify-end gap-4 mt-10'>
                        <Button disabled={step < 2} onClick={handlePrevStep}>Previous {step > 1 && "=> " + STEPS[step - 1]}</Button>
                        <Button disabled={step >= 5}>Next {step < 5 && "=> " + STEPS[step + 1]}</Button>
                    </div>
                    {/* <Button className="p-5" disabled={pending} type="submit">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Submit </Button> */}
                </form>
            </Form>
        </div >
    )
}

const RenderInput = ({ form, name, label }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...field} />
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
export default Step1