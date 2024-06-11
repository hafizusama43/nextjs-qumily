"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form } from '@/components/ui/form'
import { AlertTriangle, CircleArrowLeft, CircleArrowRight, Trash2 } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const FormSchema = z.object({
    placement: z.string().min(1, { message: "Placement is required" }).default('Placement Top'),
    percentage: z.coerce.number().min(1, 'Percentage must be greater then 0').default(0),
});

interface BiddingData {
    placement: string;
    percentage: number;
    id: string
}
const Step2 = ({ step, STEPS, handlePrevStep, handleNextStep, campaignData }) => {
    const [biddingData, setBiddingData] = useState<BiddingData[]>([])
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            placement: 'Placement Top',
            percentage: 0,
        },
    })

    useEffect(() => {
        console.log(campaignData)
    }, [campaignData])


    const onSubmit = (data) => {
        const id = uuidv4();
        const objectWithId = { ...data, id: id };
        console.log(objectWithId)
        setBiddingData((prevState) => [...prevState, objectWithId]);
        form.reset()
    }

    const handleDeleteBtn = (id: string) => {
        setBiddingData((prevState) => (
            prevState.filter((item) => item.id !== id)
        ));
    }

    const handleNextStepClick = () => {
        if (biddingData.length < 1) {
            form.trigger();
        } else {
            handleNextStep(biddingData, 'bidding-adjustment')
        }
    }



    return (
        <div>
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
                        <Button>Add Placement</Button>
                    </div>
                </form>
            </Form>
            <Separator className='my-6'></Separator>
            <div className='flex justify-end gap-4'>
                <Button type="button" disabled={step < 2} onClick={handlePrevStep}><CircleArrowLeft /> &nbsp; {step > 1 && STEPS[step - 1]}</Button>
                <Button onClick={handleNextStepClick} disabled={step >= 5}>{step < 5 && STEPS[step + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
            <Alert className="my-5">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    The placements you add will appear in table below. Each placement will be added as a seprate row when creating campaign.
                </AlertDescription>
            </Alert>
            <Table className='mt-10' id='placements_table'>
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
        </div>
    )
}

export default Step2