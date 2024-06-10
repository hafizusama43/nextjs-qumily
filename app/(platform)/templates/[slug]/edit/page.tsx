"use client"


import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from '@/components/ui/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Spin } from '@/components/ui/spin';
import ZoomControl from './_zoom';
import EditableCell from './_editable';
import { InfoIcon } from 'lucide-react';
import TemplateHeader from '@/components/ui/_header';

const EditTemp = () => {
    const params = useParams<{ slug: string }>();
    const [pending, setPending] = useState(false);
    const [pendingSave, setPendingSave] = useState(false);
    const [data, setData] = useState([])
    const [editableCell, setEditableCell] = useState(null);

    const getData = useCallback(async () => {
        try {
            console.log('Fetching template data')
            setPending(true)
            const res = await axios.get(`/api/template-data?slug=${params.slug}`);
            if (res.data.success) {
                setData(res.data.data)
            }
            setPending(false)
        } catch (error) {
            setPending(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }
    }, [params.slug])

    useEffect(() => {
        getData()
    }, [getData])

    // Function to handle cell double-click
    const handleCellDoubleClick = (id, field) => {
        setEditableCell({ id, field });
    };

    // Function to handle cell value change
    const handleCellValueChange = (e, id, field) => {
        setData(prevData =>
            prevData.map(item => {
                if (item.campaign_templates_data_id === id) {
                    return { ...item, [field]: e.target.value };
                }
                return item;
            })
        );
    };

    // Handle handleSaveChanges
    const handleSaveChanges = async () => {
        setPendingSave(true);
        console.log(params.slug)
        setTimeout(() => {
            setPendingSave(false);
        }, 3000);

        try {
            console.log('Updating template data')
            setPendingSave(true)
            const res = await axios.put(`/api/template-data?slug=${params.slug}`, {
                data: data
            });
            // if (res.data.success) {
            //     setData(res.data.data)
            // }
            setPendingSave(false)
            toast({ description: res.data.message })
        } catch (error) {
            setPendingSave(false)
            toast({ title: "Something went wrong", description: error.response.data.message, variant: "destructive" })
        }

    }

    const excludedKeys = ["campaign_templates_data_id", "template_id"];

    return (
        <div>
            <TemplateHeader>
                <Label>Editing &quot;<b>{params.slug && capitalizeFirstLetter(params.slug.split("-").join(" "))}</b>&quot; template</Label>
                <div className='flex gap-2'>
                    <Link href={`/templates/${params.slug}/create-campaign`}><Button size='sm'>Create campaign</Button></Link>
                    <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button>
                </div>
            </TemplateHeader>
            <div className='flex gap-5'>
                <Alert className="my-5">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        To edit a cell <b>Double Click</b> on it and after editing click any where to close cell editor. Make sure to click <b>Save Changes</b> button to save all changes.
                    </AlertDescription>
                </Alert>
                <ZoomControl></ZoomControl>
            </div>
            <Table className='mb-40 border rounded custom-template-table'>
                <TableHeader>
                    <TableRow>
                        {Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).map((item, index) => <TableHead key={item}>{SPONSORED_PRODUCTS_CAMPAIGNS[item]}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? <>{data.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                {Object.keys(item).filter(key => !excludedKeys.includes(key)).map((item_inner, index_inner) => {
                                    return (
                                        <TableCell key={item_inner + "_" + index_inner} onDoubleClick={() => handleCellDoubleClick(item.campaign_templates_data_id, item_inner)}>
                                            <EditableCell
                                                id={item.campaign_templates_data_id}
                                                value={item[item_inner]}
                                                field={item_inner}
                                                editableCell={editableCell}
                                                onChange={handleCellValueChange}
                                                onBlur={() => setEditableCell(null)}
                                            />
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}</> : <TableRow ><TableCell className="text-center" colSpan={Object.keys(SPONSORED_PRODUCTS_CAMPAIGNS).length}>
                        {pending ? <Spin className="m-auto" variant="light" size="default"></Spin> : 'No results.'}</TableCell></TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}

export default EditTemp
