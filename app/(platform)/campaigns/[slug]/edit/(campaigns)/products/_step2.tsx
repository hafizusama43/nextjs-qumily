"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bigint, z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, Trash2 } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { getSpecificKeyValues, PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { initialState } from './products'
import loadJsConfig from 'next/dist/build/load-jsconfig'
import { Kablammo } from 'next/font/google'
import { Card } from '@/components/ui/card'

const FormSchema = z.object({
    placement: z.string().min(1, { message: "Placement is required" }).default('Placement Top'),
    percentage: z.coerce.number().min(1, 'Percentage must be greater then 0').default(0),
});

interface BiddingData {
    placement: string;
    percentage: number;
    id: string
}
const Step2 = ({ STEPS, handlePrevStep, handleNextStep }) => {

    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep } = useCampaignsStore()
    const [biddingData, setBiddingData] = useState<BiddingData[]>([])
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            placement: 'Placement Top',
            percentage: 0,
        },
    })


    useEffect(() => {
        console.log('Setting bidding adjustment form state')
        var biddingObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "bidding adjustment");
        console.log(biddingObjExists)
        if (biddingObjExists.length > 0) {
            const biddingObjValues = getSpecificKeyValues(biddingObjExists[0], ['placement', 'percentage']);
            console.log(biddingObjValues)
            const { placement, percentage } = biddingObjValues
            const reverseArray = reverseTransformArray(placement, percentage)
            setBiddingData(reverseArray)
        }
    }, [campaignData, form])

    const onSubmit = (data) => {
        const id = uuidv4();
        const objectWithId = { ...data, id: id };
        setBiddingData((prevState) => [...prevState, objectWithId]);
        form.reset()
    }

    // Function to reverse the transformation for arrays
    const reverseTransformArray = (placementArray, percentageArray) => {
        return placementArray.map((placementObj, index) => {
            const id = Object.keys(placementObj)[0];
            const placement = placementObj[id];
            const percentage = percentageArray[index][id];

            return { id, placement, percentage };
        });
    }

    const handleDeleteBtn = (id: string) => {
        setBiddingData((prevState) => (
            prevState.filter((item) => item.id !== id)
        ));
    }

    const handleNextStepClick = () => {
        // handleNextStep(biddingData, 'bidding-adjustment')
        // Get existsing campaign object to retain values in next object
        var campaignObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "campaign");
        const campaignObjValues = getSpecificKeyValues(campaignObjExists[0], ['product', 'operation', 'campaign_id', 'state']);

        // const { placementArray, percentageArray } = transformObject(data);
        console.log(biddingData)
        var objExists = campaignData.filter((item) => item.entity.toLowerCase() === "bidding adjustment");
        // if (objExists.length > 0) {
        //     console.log('Object found Bidding Adjustment : Updating')
        //     const updatedObj = {
        //         ... initialState,
        //         ...campaignObjValues,
        //         'entity': STEPS[currentStep],
        //         ['placement']: placementArray,
        //         ['percentage']: percentageArray
        //     };
        //     // setCampaignData(prevData =>
        //     //     prevData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
        //     // );
        // } else {
        //     console.log('Object not found Bidding Adjustment : Creating')
        //     const updatedObj = {
        //         ...initialState,
        //         ...campaignObjValues,
        //         'entity': STEPS[currentStep],
        //         ['placement']: placementArray,
        //         ['percentage']: percentageArray
        //     };
        // }

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
                    <Alert className="my-5">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            The placements you add will appear in table below. Each placement will be added as a seprate row when creating campaign.
                        </AlertDescription>
                    </Alert>
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
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && STEPS[currentStep - 1]}</Button>
                <Button onClick={handleNextStepClick} disabled={currentStep >= 5}>{currentStep < 5 && STEPS[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default Step2