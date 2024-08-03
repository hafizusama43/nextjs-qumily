"use client";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from './button'
import { Moon, Plus, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Switch } from "./switch";
import { Label } from "./label";
import { useTheme } from "next-themes";

const Navbar = ({ org_dashboard = false }: { org_dashboard?: boolean }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    return (
        <div className='border-b-2 border-b-gray-200 fixed top-0 w-full backdrop-blur z-20'>
            <div className='px-2 py-2 md:py-4 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                {org_dashboard ?
                    <>
                        <div className="flex items-center">
                            <Link href="/" className='flex items-center'>
                                <Image src="/logoNew.png" width={55} height={55} alt='Qumily logo'></Image>
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
                            <Image src="/logoNew.png" width={50} height={50} alt='Qumily logo'></Image>
                            <span className='font-bold'>Qumily</span>
                        </Link>
                        <div className="flex items-center">
                            {mounted && <div className="flex items-center mr-4">
                                <Switch id="airplane-mode" checked={resolvedTheme === 'dark'} onCheckedChange={(e) => e ? setTheme('dark') : setTheme('light')}>{resolvedTheme === 'light' ? <Sun /> : <Moon />}</Switch>
                            </div>}
                            {!isSignedIn && <>
                                <Link href="/sign-in"><Button className='mr-4' variant="secondary">Login</Button></Link>
                                <Link href="join-qumily"><Button className='hidden md:block'>Get Qumily for free</Button></Link>
                            </>
                            }
                            {isSignedIn && process.env.NEXT_ENV === 'development' && <Link href="/templates"><Button className='mr-4' variant="secondary">Templates</Button></Link>}
                            {isSignedIn && process.env.NEXT_ENV === 'development' && <Link href="/organizations"><Button className='mr-4' variant="secondary">Organizations</Button></Link>}
                            {isSignedIn && <Link href="/campaigns"><Button className='mr-4' variant="secondary">Campaigns</Button></Link>}
                            {isSignedIn && <span className="ml-2 flex items-center"><UserButton afterSignOutUrl="/" userProfileMode="navigation" userProfileUrl="/user-profile"></UserButton></span>}
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default Navbar
