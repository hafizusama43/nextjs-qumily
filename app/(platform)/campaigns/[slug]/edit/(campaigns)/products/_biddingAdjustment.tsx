"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, Trash2 } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { getSpecificKeyValues, getStepName, PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCampaignsStore } from '@/hooks/useSponseedProductsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import CustomAlert from '@/components/ui/CustomAlert'

const FormSchema = z.object({
    placement: z.string().min(1, { message: "Placement is required" }).default('Placement Top'),
    percentage: z.coerce.number().min(1, 'Percentage must be greater then 0').max(900, { message: "Percentage must be greater then 900" }).default(0),
});

const BiddingAdjustment = ({ steps }) => {

    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, biddingData, setBiddingData } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            placement: 'Placement Top',
            percentage: 0,
        },
    })

    const onSubmit = (data) => {
        const id = uuidv4();
        const objectWithId = { ...data, id: id };
        const updatedData = [...biddingData, objectWithId]
        setBiddingData(updatedData);
        form.reset()
    }


    const handleDeleteBtn = (id: string) => {
        const updatedData = biddingData.filter((item) => item.id !== id)
        setBiddingData(updatedData);
    }

    const handleNextStepClick = () => {
        var entity: string = getStepName(steps[currentStep]);
        // Bidding adjustments is optional if not added any then skip 
        if (biddingData.length > 0) {
            // Get existing campaign object to retain values in next object
            var campaignObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
            const campaignObjValues = getSpecificKeyValues(campaignObjExists[0], ['product', 'operation', 'campaign_id', 'state', 'bidding_strategy']);
            var biddingObjExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());

            if (biddingObjExists.length > 0) {
                console.info(`Object "${entity}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...campaignObjValues,
                    'entity': entity,
                    ['placement']: '%placement%',
                    ['percentage']: '%percentage%'
                };
                const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
                setCampaignData(arr)
            } else {
                console.info(`Object "${entity}" not found : Creating`)
                const updatedObj = {
                    ...initialState,
                    ...campaignObjValues,
                    'entity': entity,
                    ['placement']: '%placement%',
                    ['percentage']: '%percentage%'
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
        setNextStep();
    }



    return (
        <div>
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="block md:flex gap-5">
                                <div className='basis-1/2 w-full'>
                                    <RenderSelect name={"placement"} form={form} options={PLACEMENT} label={SPONSORED_PRODUCTS_CAMPAIGNS.placement}></RenderSelect>
                                </div>
                                <div className='basis-1/2 w-full'>
                                    <RenderInput type='number' name={"percentage"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.percentage}></RenderInput>
                                </div>
                            </div>
                            <div className='flex justify-end gap-4 mt-10'>
                                <Button className='block w-full' >Add Placement</Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className='basis-1/2'>
                    <CustomAlert iconName={"triangle-alert"} title='Heads up!' variant='info'>
                        The placements you add will appear in table below. Each placement will be added as a separate row when creating campaign.
                    </CustomAlert>
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
                <Button onClick={handleNextStepClick} disabled={currentStep >= 5}>{currentStep < 5 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default BiddingAdjustment