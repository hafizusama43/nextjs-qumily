import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in into Taskify',
};

const page = () => {
    return (
        <div className='flex justify-center items-center flex-col'>
            <SignIn />
        </div>
    );
}

export default page
