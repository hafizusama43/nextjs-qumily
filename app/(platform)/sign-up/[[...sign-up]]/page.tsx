import { SignUp } from '@clerk/nextjs';
import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
      <SignUp fallbackRedirectUrl={"/"}/>
    </div>
  );
}

export default page