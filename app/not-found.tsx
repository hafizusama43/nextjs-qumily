import { Metadata } from 'next';
import Image from 'next/image'
import React from 'react'
import BackButton from '@/components/ui/BackButton';


export const metadata: Metadata = {
    title: '404 not found',
    description: 'The route your are trying to access is not available.',
};

const Error = () => {
    return (
        <div className='h-[100vh] flex justify-center items-center flex-col'>
            <div className='bg-white p-10 rounded-3xl border border-gray-300'>
                <Image src={"/not-found.png"} width={400} height={400} alt='error.png'></Image>
                <BackButton></BackButton>
            </div>
        </div>
    )
}

export default Error
