"use client"
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const params = useParams<{ slug: string }>();
    return (
        <div>{params.slug}</div>
    )
}

export default page