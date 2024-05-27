"use client"
import React from 'react'
import { Button } from './button'
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();
    return (
        <Button onClick={() => { router.back() }}>Go Back</Button>
    )
}

export default BackButton
