"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RocketIcon } from 'lucide-react'
import TemplateHeader from '../../_header'
import { useParams } from 'next/navigation'
import { capitalizeFirstLetter } from '@/lib/helpers'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { z } from 'zod'
import { toast } from '@/components/ui/use-toast'
import { Spin } from '@/components/ui/spin'


const FormSchema = z.object({
    template_name: z.string().min(1, { message: "Template name is required" }).min(5, { message: "Template name should contain at least \"5\" characters." }),
    template_category: z.string().min(5, { message: "Template category is required" }),
})

const CreateCampaign = () => {
    const [pending, setPending] = useState(false);
    const params = useParams<{ slug: string }>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            template_name: "",
            template_category: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setPending(true)
            const res = await axios.post('/api/template', { ...data });
            if (res.data.success) {
                // setCreatedRow(res.data.data[0])
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
        <React.Fragment>
            <TemplateHeader>
                <Label>Creating new campaign using &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; template</Label>
                <Link href={`/templates/${params.slug}`}><Button size='sm'>View template</Button></Link>
            </TemplateHeader>
            <Alert className="my-5">
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    To create a template enter a template name (eg. &lsquo;Summer paid campaign&lsquo;) and later edit this template to add template data.
                </AlertDescription>
            </Alert>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="block md:flex gap-5">
                        <div className='basis-1/2 w-full'>
                            <FormField
                                control={form.control}
                                name="template_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template name</FormLabel>
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
                                name="template_category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template category</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button className="p-5" disabled={pending} type="submit">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Submit </Button>
                </form>
            </Form>
        </React.Fragment>
    )
}

export default CreateCampaign
