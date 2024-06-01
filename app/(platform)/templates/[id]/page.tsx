"use client"

import { useParams } from 'next/navigation';
import React from 'react'


const EditTemplate = () => {
    const params = useParams<{ id: string }>();
    return (
        <div>
            Campaign template {params.id}
        </div>
    )
}

export default EditTemplate
