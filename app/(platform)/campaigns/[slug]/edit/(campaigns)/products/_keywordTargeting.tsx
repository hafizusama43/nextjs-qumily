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
import { useCampaignsStore } from '@/hooks/useSponseedProductsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import { Spin } from '@/components/ui/spin'
import { RenderInput } from '../_renderInput'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useParams } from 'next/navigation'


const FormSchema = z.object({
    keyword_text: z.string().min(1, { message: "Keyword text is required" }),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    bid: z.coerce.number().min(0.1, 'Bid must be at least 0.1'),
});


const KeywordTargeting = ({ steps }) => {
    const { pendingSave,
        setCampaignData,
        currentStep,
        setPrevStep,
        keywordTargetingData,
        setKeywordTargetingData,
        setPendingSave,
        campaignData,
        targetingType,
        biddingData,
        skus,
        negKeywordData,
        campaignNegKeywordData,
        campaignProductsCount,
        targetingStrategy
    } = useCampaignsStore()
    const [triggerSave, setTriggerSave] = useState(false)
    const params = useParams<{ slug: string }>();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            keyword_text: '',
            items: [],
            bid: 0
        },
    })

    const onSubmit = (data) => {
        const id = uuidv4();
        console.log(data)
        var keywordArray: string[] = data.keyword_text.split(',');
        keywordArray = keywordArray.filter(v => v != '');
        const types: string[] = data.items ? data.items : [];

        // Function to check if the keyword already exists for a match type
        const keywordExists = (array, keyword, type) => {
            return array.some(item => item.keyword_text === keyword && item.match_type === type);
        };

        types.forEach(type => {
            keywordArray.forEach(keyword => {
                if (!keywordExists(keywordTargetingData, keyword, type)) {
                    keywordTargetingData.push({
                        id: uuidv4(),
                        keyword_text: keyword,
                        match_type: type,
                        bid: data.bid
                    });
                }
            });
        });
        form.reset();
        console.log(keywordTargetingData)
    }

    const handleDeleteBtn = (id: string) => {
        const updatedData = keywordTargetingData.filter((item) => item.id !== id)
        setKeywordTargetingData(updatedData);
    }

    const handleSaveChanges = () => {
        var entity: string = getStepName(steps[currentStep]);
        if (keywordTargetingData.length > 0) {
            var adGroupObjExists = campaignData.filter((item) => item.entity.toLowerCase() === "ad group");
            const adGroupObjValues = getSpecificKeyValues(adGroupObjExists[0], ['product', 'operation', 'ad_group_id', 'campaign_id', 'state']);
            var objExists = campaignData.filter((item) => item.entity.toLowerCase() === entity.toLowerCase());

            if (objExists.length > 0) {
                console.info(`Object "${entity}" found : Updating`)
                const updatedObj = {
                    ...initialState,
                    ...adGroupObjValues,
                    'entity': entity,
                    ['keyword_text']: '%keyword_text%',
                    ['match_type']: '%match_type%',
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
                    ['keyword_text']: '%keyword_text%',
                    ['match_type']: '%match_type%',
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

        // Doing this because we have added/updated another object in campaignData so we get updated state when sending axios.post
        setTriggerSave(true)
    }

    useEffect(() => {
        console.log(`Saving ${targetingType} : ${targetingStrategy} strategy campaign.`)
        if (triggerSave) {
            setTriggerSave(false)
            setPendingSave(true);

            const handleSaveChanges = async () => {
                try {
                    await axios.post('/api/campaigns/campaign-data',
                        {
                            campaignData,
                            targetingType,
                            biddingData,
                            skus,
                            slug: params.slug,
                            negKeywordData,
                            campaignNegKeywordData,
                            campaignProductsCount,
                            targetingStrategy,
                            keywordTargetingData
                        },
                        {
                            headers: {
                                "Accept": "application/json"
                            }
                        }
                    );
                    toast({ description: 'Changes saved successfully!' })
                    setPendingSave(false);
                } catch (error) {
                    setPendingSave(false);
                    console.log(error)
                }
            }
            handleSaveChanges()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerSave])


    return (
        <div>
            <div className='flex flex-row gap-5 mb-5'>
                <div className='basis-1/2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <div className="w-full">
                                <RenderTextArea name={"keyword_text"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.keyword_text}></RenderTextArea>
                            </div>
                            <div className='w-full'>
                                <RenderInput type='number' name={"bid"} form={form} label={SPONSORED_PRODUCTS_CAMPAIGNS.bid}></RenderInput>
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Match type</FormLabel>
                                            </div>
                                            {Object.keys(MATCH_TYPE_KEYWORD_TARGETING).map((item, index) => (
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
                                                                    {MATCH_TYPE_KEYWORD_TARGETING[item]}
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
                    <Card className='mt-8'>
                        <Table className='' id='placements_table'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Keyword text</TableHead>
                                    <TableHead>Match type</TableHead>
                                    <TableHead>Bid</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keywordTargetingData.length > 0 ? <>{keywordTargetingData.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.keyword_text}</TableCell>
                                            <TableCell>{item.match_type}</TableCell>
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
                <Button type="submit" onClick={() => { handleSaveChanges() }} disabled={pendingSave}>{pendingSave ? <Spin variant="light" size="sm"></Spin> : <SaveIcon />} &nbsp; Save changes</Button>
            </div>
        </div>
    )
}

export default KeywordTargeting
