"use client"


import { useParams } from 'next/navigation';
import React from 'react'

const EditTemp = () => {
    const params = useParams<{ slug: string }>();
    return (
        <div>
            Editing template {params.slug}
        </div>
    )
}

export default EditTemp
