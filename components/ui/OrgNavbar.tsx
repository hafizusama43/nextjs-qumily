"use client";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './button'
import { Plus } from "lucide-react";

const OrgNavbar = () => {

    return (
        <div className='shadow-md fixed top-0 w-full backdrop-blur z-10 bg-white'>
            <div className='px-2 py-2 md:py-4 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                <div className="flex items-center">
                    <Link href="/" className='flex items-center'>
                        <Image src="/logo-new.png" width={55} height={55} alt='Taskify logo'></Image>
                    </Link>
                    <OrganizationSwitcher hidePersonal></OrganizationSwitcher>
                </div>

                <div className="flex items-center">
                    
                    <UserButton></UserButton>
                </div>
            </div>
        </div>
    )
}

export default OrgNavbar
