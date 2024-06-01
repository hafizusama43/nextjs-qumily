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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import React, { useState } from "react"
import TemplateHeader from "../_header"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "lucide-react"
import { Spin } from "@/components/ui/spin";

const FormSchema = z.object({
    template_name: z.string().min(1, { message: "Template name is required" }).min(5, { message: "Template name should contain at least \"5\" characters." }),
})

interface createdRowType {
    campaign_templates_id: number;
    camping_name: string;
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
                    <Button className="p-5" disabled={pending} type="submit">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Submit </Button>
                </form>
            </Form>
            {createdRow &&
                <Alert className="my-10">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Template created!</AlertTitle>
                    <AlertDescription>
                        Template <b>&qout;{createdRow.camping_name}&qout;</b> is created successfully. Click <Link href={`/templates/edit/${createdRow.campaign_templates_id}`}><b>here</b></Link> to edit the template.
                    </AlertDescription>
                </Alert>
            }

        </React.Fragment>

    )
}
export default InputForm