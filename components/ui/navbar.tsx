"use client";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from './button'
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = ({ org_dashboard = false }: { org_dashboard?: boolean }) => {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <div className='border-b-2 border-b-gray-200 fixed top-0 w-full backdrop-blur z-10 bg-white'>
            <div className='px-2 py-2 md:py-4 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                {org_dashboard ?
                    <>
                        <div className="flex items-center">
                            <Link href="/" className='flex items-center'>
                                <Image src="/not-found.png" width={55} height={55} alt='asda logo'></Image>
                            </Link>
                            <Button><Plus /></Button>
                        </div>

                        <div className="flex items-center">
                            <OrganizationSwitcher hidePersonal></OrganizationSwitcher>
                            <UserButton></UserButton>
                        </div>
                    </> :
                    <>
                        <Link href="/" className='flex items-center'>
                            <Image src="/not-found.png" width={50} height={50} alt='Taskify logo'></Image>
                            <span className='font-bold'>Taskify</span>
                        </Link>
                        <div className="flex items-center">

                            {!isSignedIn && <>
                                <Link href="/sign-in"><Button className='mr-4' variant="secondary">Login</Button></Link>
                                <Link href="join-taskify"><Button className=''>Get Taskify for free</Button></Link>
                            </>
                            }
                            {isSignedIn && <Link href="/templates"><Button className='mr-4' variant="secondary">Templates</Button></Link>}
                            {isSignedIn && <Link href="/organizations"><Button className='mr-4' variant="secondary">Organisations</Button></Link>}
                            {isSignedIn && <span className="ml-2 flex items-center"><UserButton afterSignOutUrl="/" userProfileMode="navigation" userProfileUrl="/user-profile"></UserButton></span>}
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default Navbar
