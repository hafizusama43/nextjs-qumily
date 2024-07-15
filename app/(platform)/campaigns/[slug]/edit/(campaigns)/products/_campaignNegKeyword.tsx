"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, SaveIcon, Trash2 } from 'lucide-react'
import { getSpecificKeyValues, MATCH_TYPE, PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import { Checkbox } from '@radix-ui/react-checkbox'

const FormSchema = z.object({
    keyword_text: z.string().min(1, { message: "Keyword text is required" }),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
});


const CampaignNegKeyword = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setBiddingData } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword_text: '',
            items: [],
        },
    })

    const onSubmit = (data) => {
        const id = uuidv4();
        // const objectWithId = { ...data, id: id };
        console.log(data);
        // const updatedData = [...biddingData, objectWithId]

        // setBiddingData(updatedData);
        // form.reset()
    }

    const handleDeleteBtn = (id: string) => {
        const updatedData = biddingData.filter((item) => item.id !== id)
        setBiddingData(updatedData);
    }

    const handleNextStepClick = () => {
        // Bidding adjustments is optional if not added any then skip 
        if (biddingData.length > 0) {
            // Get existsing campaign object to retain values in next object
            var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
            const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'campaign_id', 'state']);

            var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "product targeting");

            if (objExists.length > 0) {
                console.info(`Object "${steps[currentStep]}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    ['state']: '%state%',
                    ['bid']: '%bid%',
                    ['product_targeting_expression']: '%product_targeting_expression%'
                };
                const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                setCampaignData(arr)
            } else {
                console.info(`Object "${steps[currentStep]}" not found : Creating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': 'Product Targeting',
                    ['state']: '%state%',
                    ['bid']: '%bid%',
                    ['product_targeting_expression']: '%product_targeting_expression%'
                };
                campaignData.push(updatedObj);
                setCampaignData(campaignData);
            }
        }
        // setNextStep();
    }



    return (
        <div>
            {/* <Alert className="my-5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can create four product targeting entities in <b>auto-targeting</b> campaigns if you want to define the bid amounts at the targeting level. Otherwise, Amazon will automatically create these rows, and the bid amount will match the ad group default bid. The four product targets will each have one of these four targeting expression values: <b>close-match, loose-match, substitutes, complements</b>. If you do include these four rows, you can customize the bid for each product target you want to bid on—and you can set the “state” to paused for any targeting expressions you do not want to bid on.
                </AlertDescription>
            </Alert> */}
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="w-full">
                                <RenderTextArea name={"keyword_text"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.keyword_text}></RenderTextArea>
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Sidebar</FormLabel>
                                            </div>
                                            {Object.keys(MATCH_TYPE).map((item, index) => (
                                                <FormField
                                                    key={index}
                                                    control={form.control}
                                                    name="items"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <input type='checkbox'
                                                                        checked={field.value?.includes(item)}
                                                                        onChange={(checked) => {
                                                                            if (checked.currentTarget.checked) {
                                                                                field.onChange([...field.value, item])
                                                                            } else {
                                                                                const filtered = field.value?.filter((value) => value !== item)
                                                                                field.onChange([...filtered])
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {item}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex justify-end gap-4 mt-10'>
                                <Button className='block w-full' >Add Keywords</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className='basis-1/2'>
                    <Card>
                        <Table className='' id='placements_table'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {biddingData.length > 0 ? <>{biddingData.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.placement}</TableCell>
                                            <TableCell>{item.percentage}</TableCell>
                                            <TableCell>
                                                <Trash2 className='m-auto' onClick={() => handleDeleteBtn(item.id)} role="button" color="red" />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}</> : <TableRow>
                                    <TableCell colSpan={3}><p className='text-neutral-400 mt-5 text-center m-auto'>No placements added. Please add placement to continue.</p></TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
            <Separator></Separator>
            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button onClick={handleNextStepClick} type="button"><SaveIcon /> &nbsp; Save changes</Button>
                <Button onClick={() => { form.reset() }} type="button"><SaveIcon /> &nbsp; Rest</Button>
            </div>
        </div>
    )
}

export default CampaignNegKeyword