import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'

const EditableCell = ({ id, value, field, editableCell, onChange, onBlur }) => {
    return (
        <>
            {editableCell && editableCell.id === id && editableCell.field === field ? (
                <Textarea
                    rows={5}
                    cols={220}
                    value={value}
                    onChange={(e) => onChange(e, id, field)}
                    onBlur={onBlur}
                    autoFocus // Automatically focus on the input field
                ></Textarea>
            ) : (
                value
            )}
        </>

    );
};

export default EditableCell
