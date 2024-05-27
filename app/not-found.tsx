"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const Error = () => {
    const router = useRouter();
    return (
        <div className='flex justify-center items-center flex-col'>
            <div className='bg-white p-10 rounded-3xl shadow-4xl'>
                <Image src={"/not-found.png"} width={400} height={400} alt='error.png'></Image>
                <Button className='w-full' onClick={() => { router.back() }}>Go Back</Button>
            </div>
        </div>
    )
}

export default Error
