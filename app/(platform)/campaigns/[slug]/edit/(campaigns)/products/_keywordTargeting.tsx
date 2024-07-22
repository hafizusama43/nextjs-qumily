import React from 'react'
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
import { useCampaignsStore } from '@/hooks/useCampaignsStore'
import { initialState } from './products'
import { Card } from '@/components/ui/card'
import { RenderTextArea } from '../_renderTextInput'
import { Spin } from '@/components/ui/spin'
import { RenderInput } from '../_renderInput'


const FormSchema = z.object({
    keyword_text: z.string().min(1, { message: "Keyword text is required" }),
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    bid: z.coerce.number().min(0.1, 'Bid must be at least 0.1'),
});


const KeywordTargeting = ({ steps }) => {
    const { pendingSave, setCampaignData, setNextStep, currentStep, setPrevStep, keywordTargetingData, setKeywordTargetingData } = useCampaignsStore()
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
                                    <TableCell colSpan={3}><p className='text-neutral-400 mt-5 m-auto'>No keywords added.</p></TableCell>
                                </TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>

            <div className='flex justify-end gap-4 mt-5'>
                <Button type="button" disabled={currentStep < 2} onClick={() => { setPrevStep() }}><CircleArrowLeft /> &nbsp; {currentStep > 1 && steps[currentStep - 1]}</Button>
                <Button type="submit" disabled={pendingSave}>{pendingSave ? <Spin variant="light" size="sm"></Spin> : <SaveIcon />} &nbsp; Save changes</Button>
            </div>
        </div>
    )
}

export default KeywordTargeting
