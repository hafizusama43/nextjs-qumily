import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CircleArrowLeft, CircleArrowRight, SaveIcon, Trash2 } from 'lucide-react'
import { getSpecificKeyValues, getStepName, MATCH_TYPE, MATCH_TYPE_KEYWORD_TARGETING, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCampaignsStore } from '@/hooks/useSponseredProductsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import { Spin } from '@/components/ui/spin'
import { RenderInput } from '../_renderInput'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useParams } from 'next/navigation'


const FormSchema = z.object({
    product_targeting_expression: z.string().min(1, { message: "Targeting expression is required" }),
    bid: z.coerce.number().min(0.1, 'Bid must be at least 0.1'),
});


const ProductTargeting = ({ steps }) => {
    const { pendingSave,
        setCampaignData,
        currentStep,
        setPrevStep,
        productTargetingData,
        setProductTargetingData,
        setNextStep,
        campaignData,
        targetingStrategy
    } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product_targeting_expression: '',
            bid: 0
        },
    })

    const onSubmit = (data) => {
        const id = uuidv4();
        var targetingExpressionArr: string[] = data.product_targeting_expression.split(',');
        targetingExpressionArr = targetingExpressionArr.filter(v => v != '');
        // const types: string[] = data.items ? data.items : [];

        // Function to check if the keyword already exists for a match type
        const keywordExists = (array, targetingExpression) => {
            return array.some(item => item.keyword_text === targetingExpression);
        };

        // types.forEach(type => {
        targetingExpressionArr.forEach(targetingExpression => {
            if (!keywordExists(productTargetingData, targetingExpression)) {
                productTargetingData.push({
                    id: uuidv4(),
                    product_targeting_expression: targetingExpression,
                    bid: data.bid
                });
            }
        });
        form.reset();
    }

    const handleDeleteBtn = (id: string) => {
        const updatedData = productTargetingData.filter((item) => item.id !== id)
        setProductTargetingData(updatedData);
    }

    const handleNextStepClick = () => {
        var entity: string = getStepName(steps[currentStep]);
        if (productTargetingData.length > 0) {
            var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
            const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'campaign_id', 'state']);
            var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());

            if (objExists.length > 0) {
                console.info(`Object "${entity}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['product_targeting_expression']: '%product_targeting_expression%',
                    ['bid']: '%bid%',
                };
                const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                setCampaignData(arr)
            } else {
                console.info(`Object "${entity}" not found : Creating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['product_targeting_expression']: '%product_targeting_expression%',
                    ['bid']: '%bid%',
                };
                campaignData.push(updatedObj);
                setCampaignData(campaignData);
            }
        } else {
            var entityObjIndex = campaignData.findIndex((item) => item.entity.toLowerCase() === entity.toLowerCase());
            if (entityObjIndex !== -1) {
                campaignData.splice(entityObjIndex, 1);
                setCampaignData(campaignData);
            }
        }
        setNextStep()
    }

    return (
        <div>
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="w-full">
                                <RenderTextArea name={"product_targeting_expression"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderTextArea>
                            </div>
                            <div className='w-full'>
                                <RenderInput type='number' name={"bid"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.bid}></RenderInput>
                            </div>
                            <div className='flex justify-end gap-4 mt-10'>
                                <Button className='block w-full' >Add Keywords</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className='basis-1/2'>
                    <Card className='mt-8'>
                        <Table className='' id='placements_table'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keyword text</TableHead>
                                    {/* <TableHead>Match type</TableHead> */}
                                    <TableHead>Bid</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productTargetingData.length > 0 ? <>{productTargetingData.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.product_targeting_expression}</TableCell>
                                            {/* <TableCell>{item.match_type}</TableCell> */}
                                            <TableCell>{item.bid}</TableCell>
                                            <TableCell>
                                                <Trash2 className='m-auto' onClick={() => handleDeleteBtn(item.id)} role="button" color="red" />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}</> : <TableRow>
                                    <TableCell colSpan={4}><p className='text-neutral-400 mt-5 m-auto'>No keywords added.</p></TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>

            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button onClick={handleNextStepClick} disabled={currentStep >= 7}>{currentStep < 7 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default ProductTargeting

