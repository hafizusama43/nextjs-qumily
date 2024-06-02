"use client"


import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter, SPONSORED_PRODUCTS_CAMPAIGNS } from '@/lib/helpers';
import axios from 'axios';
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
import TemplateHeader from '../../_header';
import EditableCell from './_editable';

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
            const res = await axios.put(`/api/template-data?slug=${params.slug}`);
            if (res.data.success) {
                setData(res.data.data)
            }
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
                <Button disabled={pendingSave} size='sm' onClick={() => { handleSaveChanges() }}>{pendingSave && <><Spin variant="light" size="sm"></Spin> &nbsp;  </>} Save changes</Button>
            </TemplateHeader>
            <ZoomControl></ZoomControl>
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
