import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './button'

const Footer = () => {
    return (
        <div className='fixed bottom-0 w-full border-t-2 border-t-gray-200 bg-white'>
            <div className='px-2 py-2 md:py-2 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                <Link href="/" className='flex items-center'>
                    <Image src="/logo-new.png" width={50} height={50} alt='Taskify logo'></Image>
                </Link>
                <div>
                    <Link href="/terms-conditions"><Button className='mr-4' variant="link">Terms & Conditions</Button></Link>
                    <Link href="/privacy-policy"><Button variant="link">Privacy Policy</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default Footer
