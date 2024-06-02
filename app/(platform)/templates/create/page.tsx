"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from 'axios';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import React, { useState } from "react"
import TemplateHeader from "../_header"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "lucide-react"
import { Spin } from "@/components/ui/spin";
import { TEMPLATE_CATEGORY } from "@/lib/helpers";

const FormSchema = z.object({
    template_name: z.string().min(1, { message: "Template name is required" }).min(5, { message: "Template name should contain at least \"5\" characters." }),
    template_category: z.string().min(1, { message: "Template category is required" }),
})

interface createdRowType {
    campaign_templates_id: number;
    camping_name: string;
    slug: string;
    created_by: string;
    created_at: string;
}

const InputForm = () => {
    const [pending, setPending] = useState(false);
    const [createdRow, setCreatedRow] = useState<createdRowType>();
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
        <React.Fragment>
            <TemplateHeader>
                <Label>Add new template</Label>
                <Link href="/templates"><Button size='sm'>All templates</Button></Link>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a template category" />
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
            {createdRow &&
                <Alert className="my-10">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Template created!</AlertTitle>
                    <AlertDescription>
                        Template &quot;<b>{createdRow.camping_name}</b>&quot; is created successfully. Click <Link href={`/templates/${createdRow.slug}/edit`}><b>here</b></Link> to edit the template.
                    </AlertDescription>
                </Alert>
            }

        </React.Fragment>

    )
}
export default InputForm