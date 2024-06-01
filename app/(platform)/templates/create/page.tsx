"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
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

const InputForm = () => {
    const [pending, setPending] = useState(true);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            template_name: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setPending(true)
            const res = await axios.get('/api/template');
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <TemplateHeader>
                <Label>Add new template</Label>
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
        </React.Fragment>

    )
}
export default InputForm