"use client"

import TemplateHeader from '@/components/ui/_header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import CustomAlert from '@/components/ui/CustomAlert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spin } from '@/components/ui/spin'
import { toast } from '@/components/ui/use-toast'
import { MONTH_NAMES, TEMPLATE_CATEGORY } from '@/lib/helpers'
import { CreatedCampaignType } from '@/lib/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { AlertTriangle, CheckCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const disallowedChars = /[!@#$%^&*()_+{}|<>?:"\[\]\\;',./`~=]/;

const FormSchema = z.object({
    campaign_name: z.string().min(1, { message: "Campaign template name is required" }).min(5, { message: "Campaign template name should contain at least \"5\" characters." }).refine((value) => !disallowedChars.test(value), { message: "Should not contain special characters." }),
    campaign_category: z.string().min(5, { message: "Campaign category is required" }),
})

const CreateCampaign = () => {
    const [pending, setPending] = useState(false);
    const [createdRow, setCreatedRow] = useState<CreatedCampaignType>();
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
            if (res.data.success) {
                setCreatedRow(res.data.data[0])
            }
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
            <div className='border border-gray-300 p-5 rounded-lg'>
                <CustomAlert iconName={"triangle-alert"} title='Heads up!' variant='info'>
                    Campaign template name is not campaign name.
                    Campaign template name should not contain any special characters like <b>{disallowedChars.toString()}</b> .It can be something like this <b>Sponsored product campaign {new Date().getDate().toString() + " " + MONTH_NAMES[new Date().getMonth()] + ", " + new Date().getFullYear()} </b> or more suitable and understand because it will be unique identifier for every campaign template.
                </CustomAlert>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <div className="block md:flex gap-5">
                            <div className='basis-1/2 w-full'>
                                <FormField
                                    control={form.control}
                                    name="campaign_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Campaign template name</FormLabel>
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
                {createdRow && createdRow.campaign_id &&
                    <Alert className="my-10 border-green-600 dark:border-green-500">
                        <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-500" color='#16a34a' />
                        <AlertTitle className='text-green-600 dark:text-green-500'>Campaign updated!</AlertTitle>
                        <AlertDescription>
                            {/* Sample url to edit campaign : https://nextjs-qumily-xi.vercel.app/campaigns/sp-manual-pt/edit?category=sponsored-products-campaigns */}
                            Campaign &quot;<b>{createdRow.campaign_name}</b>&quot; is created successfully. Click <Link href={`/campaigns/${createdRow.slug}/edit?category=${createdRow.campaign_category}`}><b>here</b></Link> to edit the campaign.
                        </AlertDescription>
                    </Alert>
                }
            </div>
        </div>
    )
}

export default CreateCampaign