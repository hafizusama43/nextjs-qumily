"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PencilLine, RocketIcon, Trash2 } from 'lucide-react'
import TemplateHeader from '../../_header'
import { useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'


const FormSchema = z.object({
    campaign_id: z.string().min(5, { message: "Campaign id is required" }),
    bid: z.string(),
    keyword: z.string()
})

const CreateCampaign = () => {
    const [pending, setPending] = useState(false);
    const [prodData, setProdData] = useState([])
    const params = useParams<{ slug: string }>();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            campaign_id: "",
            bid: "",
            keyword: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        const id = uuidv4();
        // Add the id to the new object
        const objectWithId = { ...data, id: id };
        setProdData((prevState) => [...prevState, objectWithId]);
        form.reset()
        // try {
        //     setPending(true)
        //     const res = await axios.post('/api/template', { ...data });
        //     if (res.data.success) {
        //         // setCreatedRow(res.data.data[0])
        //     }
        //     form.reset()
        //     toast({ description: res.data.message })
        //     setPending(false)
        // } catch (error) {
        //     setPending(false)
        //     toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        // }
    }

    const handleClearBtn = () => {
        form.reset()
        setProdData([])
    }
    const handleDeleteBtn = (id: string) => {
        setProdData((prevState) => (
            prevState.filter((item) => item.id !== id)
        ));
    }
    const handleEditBtn = (id: string) => {
        const filteredData = prodData.filter((ele) => ele.id === id);
        console.log(filteredData)

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
                                name="campaign_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Campaign id</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='basis-1/4 w-full mt-5 md:mt-0'>
                            <FormField
                                control={form.control}
                                name="keyword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keyword</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='basis-1/4 w-full mt-5 md:mt-0'>
                            <FormField
                                control={form.control}
                                name="bid"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bid</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <Button className="p-5" disabled={pending} type="submit">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Add row </Button>
                        <Button className="p-5" onClick={() => { handleClearBtn() }} disabled={pending} type="button" variant="secondary">{pending && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Clear </Button>
                    </div>
                </form>
            </Form>
            {/* <Separator className='mt-20'></Separator> */}
            <Table className='mt-40'>
                <TableHeader>
                    <TableRow>
                        <TableHead>Campaign id</TableHead>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Bid</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prodData.length > 0 && <>{prodData.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{item.campaign_id}</TableCell>
                                <TableCell>{item.keyword}</TableCell>
                                <TableCell>{item.bid}</TableCell>
                                <TableCell>
                                    <div className='flex gap-1'>
                                        <Trash2 onClick={() => handleDeleteBtn(item.id)} role="button" color="red" />
                                        <PencilLine role="button" color="green" onClick={() => handleEditBtn(item.id)} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}</>}
                </TableBody>
                <TableCaption>The rows you add appear here and will be used to create campaign.</TableCaption>
            </Table>
        </React.Fragment>
    )
}

export default CreateCampaign
