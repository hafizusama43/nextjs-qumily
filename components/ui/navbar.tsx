import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './button'

const Navbar = () => {
    return (
        <div className='shadow-md fixed top-0 w-full backdrop-blur z-10 bg-white'>
            <div className='px-2 py-2 md:py-4 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                <Link href="/" className='flex items-center'>
                    <Image src="/logo-new.png" width={50} height={50} alt='Taskify logo'></Image>
                    <span className='font-bold'>Taskify</span>
                </Link>
                <div>
                    <Link href="/sign-up"><Button className='mr-4' variant="secondary">Login</Button></Link>
                    <Link href="join-taskify"><Button className=''>Get Taskify for free</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar
