import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCampaignsStore } from '@/hooks/useSponseredProductsStore';
import { getSpecificKeyValues, getStepName, HELP_TEXT, SPONSORED_PRODUCTS_CAMPAIGNS, TARGETING_EXPRESSION_TYPE } from '@/lib/helpers';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { RenderInput } from '../_renderInput';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RenderSelect } from '../_renderSelect';
import { initialState } from './products';


const targetingSchema = z.object({
    state: z.string().min(1, { message: "" }).default('Enabled'),  // String, defaulting to 'enabled'
    bid: z.coerce.number().min(0),             // Number, with a minimum value of 0.01
    product_targeting_expression: z.enum(['close-match', 'loose-match', 'substitutes', 'complements']),  // Enum with the allowed values
});

const FormSchema = z.object({
    data: z.array(targetingSchema).length(4),  // Array of 4 objects, each matching the targetingSchema
});

const ProductTargetingAuto = ({ steps }) => {
    const { campaignData, setCampaignData, setNextStep, currentStep, setPrevStep, setProductTargetingDataAuto, productTargetingDataAuto } = useCampaignsStore()
    const [isReady, setIsReady] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            data: [
                { state: 'Enabled', bid: 0.1, product_targeting_expression: 'close-match' },
                { state: 'Enabled', bid: 0.2, product_targeting_expression: 'loose-match' },
                { state: 'Enabled', bid: 0.3, product_targeting_expression: 'substitutes' },
                { state: 'Enabled', bid: 0.4, product_targeting_expression: 'complements' },
            ],
        },
    })

    useEffect(() => {
        console.info(`Setting "${steps[currentStep]}" form state`)
        form.setValue('data', productTargetingDataAuto);
    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        var entity: string = getStepName(steps[currentStep]);
        setProductTargetingDataAuto(data.data)
        var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
        const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id']);
        var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());
        if (objExists.length > 0) {
            console.info(`Object "${entity}" found : Updating`)
            const updatedObj = {
                ...initialState,
                ...adGroupObjValues,
                'entity': entity,
                ['state']: '%state%',
                ['bid']: '%bid%',
                ['product_targeting_expression']: '%product_targeting_expression%',
            };
            const arr = campaignData.map(item => item.entity.toLocaleLowerCase() === updatedObj.entity.toLocaleLowerCase() ? updatedObj : item)
            setCampaignData(arr)
        } else {
            console.info(`Object "${entity}" not found : Creating`)
            const updatedObj = {
                ...initialState,
                ...adGroupObjValues,
                'entity': entity,
                ['state']: '%state%',
                ['bid']: '%bid%',
                ['product_targeting_expression']: '%product_targeting_expression%',
            };
            campaignData.push(updatedObj);
            setCampaignData(campaignData);
        }
        setNextStep();
    }

    useEffect(() => {
        // Trigger re-render when form values are set to populate dropdowns
        setIsReady(true);
    }, []);
    if (!isReady) return null;

    return (
        <div>
            <div className='flex justify-end gap-4 mt-5'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        {['close-match', 'loose-match', 'substitutes', 'complements'].map((expression, index) => (
                            <div className="block md:flex gap-5" key={index}>
                                <div className='basis-1/2 w-full'>
                                    <RenderInput name={`data[${index}].product_targeting_expression`} disabled form={form} label={index == 0 && SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderInput>
                                </div>
                                <div className='basis-1/2 w-full'>
                                    <RenderInput name={`data[${index}].bid`} form={form} label={index == 0 && SPONSORED_PRODUCTS_CAMPAIGNS.bid} type={"number"}></RenderInput>
                                </div>
                                <div className='basis-1/2 w-full'>
                                    <RenderSelect name={`data[${index}].state`} form={form} options={TARGETING_EXPRESSION_TYPE} label={index == 0 && SPONSORED_PRODUCTS_CAMPAIGNS.state}></RenderSelect>
                                </div>
                            </div>
                        ))}

                        <Separator className='my-3'></Separator>
                        <div className='flex justify-end gap-4 mt-10'>
                            <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                            <Button disabled={currentStep >= 7}>{currentStep < 7 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ProductTargetingAuto
