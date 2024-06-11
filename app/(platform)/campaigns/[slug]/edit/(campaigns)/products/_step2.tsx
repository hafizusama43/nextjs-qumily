"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { RenderInput } from '../_renderInput'
import { PLACEMENT, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { RenderSelect } from '../_renderSelect'
import { Separator } from '@/components/ui/separator'

const FormSchema = z.object({
    placement: z.string().min(1, { message: "Placement is required" }).default('Placement Top'),
    percentage: z.coerce.number().min(1, 'Percentage must be greater then 0').default(1),
});

const Step2 = ({ step, STEPS, handlePrevStep, handleNextStep }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            placement: 'Placement Top',
            percentage: 0,
        },
    })

    const onSubmit = () => {
        handleNextStep({}, 'bidding-adjustment')
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

                    <Separator className='my-3'></Separator>
                    <div className='flex justify-end gap-4 mt-10'>
                        <Button type="button" disabled={step < 2} onClick={handlePrevStep}><CircleArrowLeft /> &nbsp; {step > 1 && STEPS[step - 1]}</Button>
                        <Button disabled={step >= 5}>{step < 5 && STEPS[step + 1]} &nbsp; <CircleArrowRight /></Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Step2