"use client";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useOrganizationList } from "@clerk/nextjs"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import { AlignJustify, X } from "lucide-react";
import { useSidebarStore } from "@/hooks/useMobileSidebar";
import MobileSidebar from "@/app/organization/_mobileSidebar";

const OrgNavbar = () => {
    const params = useParams()
    const { setActive } = useOrganizationList();
    const pathname = usePathname();

    useEffect(() => {
        if (!setActive) return;

        console.log('as')
        setActive({
            organization: params.organizationId as string
        })
    }, [params.organizationId, setActive])

    return (
        <div className='shadow-md fixed top-0 w-full backdrop-blur z-10 bg-white'>
            <div className='px-2 py-2 md:py-4 mx-auto max-w-7xl flex flex-row items-center justify-between relative'>
                <div className="flex items-center">
                    <MobileSidebar />
                    <Link href="/" className='flex items-center'>
                        <Image src="/logoNew.png" width={55} height={55} alt='Taskify logo'></Image>
                    </Link>
                    <OrganizationSwitcher hidePersonal
                        afterCreateOrganizationUrl={"/organization/:id"}
                        afterSelectOrganizationUrl={"/organization/:id"}
                    ></OrganizationSwitcher>
                </div>

                <div className="flex items-center">
                    <UserButton></UserButton>
                </div>
            </div>
        </div>
    )
}

export default OrgNavbar
