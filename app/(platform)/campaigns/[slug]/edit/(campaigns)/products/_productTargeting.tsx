import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { Form } from '@/components/ui/form'
import { CircleArrowLeft, CircleArrowRight, CircleHelp, Trash2 } from 'lucide-react'
import { getSpecificKeyValues, getStepName, PRODUCT_TARGETING_CATEGORY, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCampaignsStore } from '@/hooks/useSponsoredProductsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import { RenderInput } from '../_renderInput'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import TemplateTooltip from '@/components/ui/_tooltip'
import { RenderSlider } from '../_renderSlider'


const FormSchema = z.object({
    product_targeting_expression: z.string().min(1, { message: "Targeting expression is required" }),
    bid: z.coerce.number().min(0.1, 'Bid must be at least 0.1'),
});

const FormSchemaCategory = z.object({
    category_id: z.string().min(1, { message: "Category id is required" }),
    category_bid: z.coerce.number().min(0.1, 'Bid must be at least 0.1'),
    rating: z.coerce.number().array().min(0.1, 'Rating must be at least 1'),
    price: z.coerce.number().array().min(0.1, 'Price must be at least 1'),
});


const ProductTargeting = ({ steps }) => {
    const {
        setCampaignData,
        currentStep,
        setPrevStep,
        productTargetingData,
        setProductTargetingData,
        setNextStep,
        campaignData,
        productTargetingType,
        setProductTargetingType
    } = useCampaignsStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product_targeting_expression: '',
            bid: 0
        },
    })

    const formCategories = useForm<z.infer<typeof FormSchemaCategory>>({
        resolver: zodResolver(FormSchemaCategory),
        defaultValues: {
            category_id: '',
            rating: [0, 5],
            price: [0, 50],
            category_bid: 0
        },
    })

    const [isReady, setIsReady] = useState(false);

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
                    product_targeting_expression: "asin=" + "\"" + targetingExpression + "\"",
                    bid: data.bid
                });
            }
        });
        form.reset();
    }

    const onSubmitCategory = (data) => {
        var pteStr: string = `category = "${data.category_id}" `;
        const id = uuidv4();
        console.log(data)
        if (data.rating[0] > 0 && data.rating[1] < 5) {
            pteStr += `rating ${data.rating[0]} - ${data.rating[1]} `
        }
        else if (data.rating[0] > 0) {
            pteStr += `rating > ${data.rating[0]} `
        }
        else if (data.rating[1] < 5) {
            pteStr += `rating < ${data.rating[1]} `
        }

        if (data.price[0] > 0 && data.price[1] < 50) {
            pteStr += `price ${data.price[0]} - ${data.price[1]} `
        }
        else if (data.price[0] > 0) {
            pteStr += `price > ${data.price[0]} `
        }
        else if (data.price[1] < 50) {
            pteStr += `price < ${data.price[1]} `
        }

        productTargetingData.push({
            id: uuidv4(),
            product_targeting_expression: pteStr.trim(),
            bid: data.category_bid
        });
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

    useEffect(() => {
        // Trigger re-render when form values are set to populate dropdowns
        setIsReady(true);
    }, []);
    if (!isReady) return null;

    return (
        <div>
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2 space-y-2'>
                    <Label className='mb-2'>Product Targeting type &nbsp;
                        <TemplateTooltip title={'Product Targeting type'}>
                            <CircleHelp className="inline !text-blue-600 h-3 w-3 mb-[2px] cursor-pointer" />
                        </TemplateTooltip>
                    </Label>
                    <Select onValueChange={(e) => {
                        setProductTargetingType(e)
                        form.reset();
                        formCategories.reset();
                    }} value={productTargetingType}>

                        <SelectTrigger>
                            <SelectValue placeholder="Select a campaign category" />
                        </SelectTrigger>

                        <SelectContent>
                            {Object.keys(PRODUCT_TARGETING_CATEGORY).map((item, index) => <SelectItem
                                key={index}
                                value={item}>
                                {PRODUCT_TARGETING_CATEGORY[item]}
                            </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className='basis-1/2'></div>
            </div>
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2'>
                    {productTargetingType === "individual" ?
                        <Form {...form} key="individual_form">
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                <div className="w-full">
                                    <RenderTextArea name={"product_targeting_expression"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.product_targeting_expression}></RenderTextArea>
                                </div>
                                <div className='w-full'>
                                    <RenderInput type='number' name={"bid"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.bid}></RenderInput>
                                </div>
                                <div className='flex justify-end gap-4 mt-10'>
                                    <Button className='block w-full' >Add Product</Button>
                                </div>
                            </form>
                        </Form> :
                        <Form {...formCategories} key="category_form">
                            <form onSubmit={formCategories.handleSubmit(onSubmitCategory)} className="w-full space-y-6">
                                <div className="w-full">
                                    <RenderInput name={"category_id"} form={formCategories} label={"Category Id"}></RenderInput>
                                </div>
                                <div className='w-full'>
                                    <RenderInput type='number' name={"category_bid"} form={formCategories} label={SPONSORED_PRODUCTS_CAMPAIGNS.bid}></RenderInput>
                                </div>
                                <div className='w-full space-y-4'>
                                    <RenderSlider max={5} name={"rating"} form={formCategories} label={"Rating Range"} helpText='If values not changed then rating will be excluded'></RenderSlider>
                                </div>
                                <div className='w-full space-y-4'>
                                    <RenderSlider max={50} name={"price"} form={formCategories} label={"Price Range"} helpText='If values not changed then price will be excluded'></RenderSlider>
                                </div>
                                <div className='flex justify-end gap-4 mt-10'>
                                    <Button className='block w-full' >Add Product</Button>
                                </div>
                            </form>
                        </Form>
                    }
                </div>
                <div className='basis-1/2'>
                    <Card className='mt-8'>
                        <Table className='' id='placements_table'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Targeting Expression</TableHead>
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
                                    <TableCell colSpan={4}><p className='text-neutral-400 mt-5 m-auto'>No product targeting expression added.</p></TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
            <Separator></Separator>
            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button onClick={handleNextStepClick} disabled={currentStep >= 7}>{currentStep < 7 && steps[currentStep + 1]} &nbsp; <CircleArrowRight /></Button>
            </div>
        </div>
    )
}

export default ProductTargeting