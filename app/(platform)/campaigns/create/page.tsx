"use client"

import TemplateHeader from '@/components/ui/_header'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spin } from '@/components/ui/spin'
import { toast } from '@/components/ui/use-toast'
import { TEMPLATE_CATEGORY } from '@/lib/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    campaign_name: z.string().min(1, { message: "Campaign name is required" }).min(5, { message: "Template name should contain at least \"5\" characters." }),
    campaign_category: z.string().min(5, { message: "Campaign category is required" }),
})

const CreateCampaign = () => {
    const [pending, setPending] = useState(false);
    // const [createdRow, setCreatedRow] = useState<createdRowType>();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            campaign_name: "",
            campaign_category: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setPending(true)
            const res = await axios.post('/api/campaigns/create', { ...data });
            // if (res.data.success) {
            //     setCreatedRow(res.data.data[0])
            // }
            form.reset()
            toast({ description: res.data.message })
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }

    return (
        <div>
            <TemplateHeader>
                <Label>Create new campaign</Label>
                <Link href="/campaigns"><Button size='sm'>All campaigns</Button></Link>
            </TemplateHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <FormField
                                control={form.control}
                                name="campaign_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Campaign name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='basis-1/2 w-full mt-5 md:mt-0'>
                            <FormField
                                control={form.control}
                                name="campaign_category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Campaign category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a campaign category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {Object.keys(TEMPLATE_CATEGORY).map((item, index) => <SelectItem
                                                    key={index}
                                                    value={item}>
                                                    {TEMPLATE_CATEGORY[item]}
                                                </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button className="p-5" disabled={pending} type="submit">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Submit </Button>
                </form>
            </Form>
            <div>
                {Object.keys(TEMPLATE_CATEGORY).map((item, index) => {
                    return (
                        <Link className='block mt-3' href={`/campaigns/create/${item}`}>{TEMPLATE_CATEGORY[item]}</Link>
                    )
                })}
            </div>
        </div>
    )
}

export default CreateCampaign