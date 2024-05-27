import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up into Taskify',
};


const page = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
      <SignUp fallbackRedirectUrl={"/"}/>
    </div>
  );
}

export default page