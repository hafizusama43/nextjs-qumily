import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { useLocalStorage } from 'usehooks-ts'
import React, { useEffect } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Layout, Plus } from 'lucide-react'
import NavItem from './_navItem'

interface SidebarProps {
    storageKey?: string
}
const SideBar = ({ storageKey = 't-sidebar-state' }: SidebarProps) => {
    const [expanded, setExpanded, removeValue] = useLocalStorage<Record<string, any>>(storageKey, {})
    const { organization: activeOrg, isLoaded: isOrgLoaded } = useOrganization();
    const { userMemberships, isLoaded: isOrgListLoaded } = useOrganizationList({
        userMemberships: { infinite: true }
    });

    useEffect(() => {
        console.log('render')
    }, [])
    
    const defaultValue: string[] = Object.keys(expanded).reduce((arr: string[], key: string) => {
        if (expanded[key]) {
            arr.push(key)
        }
        return arr
    }, [])

    console.log(defaultValue)

    const onExpand = (id: string) => {
        setExpanded((curr) => ({
            ...curr,
            [id]: !expanded[id]
        }))
    }

    return (
        <React.Fragment>
            {
                !isOrgListLoaded || !isOrgLoaded || userMemberships.isLoading ? <Skeleton className="h-[400px] w-[100%] rounded-xl"></Skeleton> :
                    <div className='border-r border-r-slate-300 min-h-[400px] max-md:border-none'>
                        <div className='flex justify-between items-center md:p-2'>
                            <span>Workspaces {userMemberships.count}</span>
                            <Button asChild size="icon" variant="ghost">
                                <Link href="/organizations">
                                    <Plus></Plus>
                                </Link>
                            </Button>
                        </div>
                        <Accordion type="multiple" defaultValue={defaultValue}>
                            {userMemberships && userMemberships.count > 0 && userMemberships.data.map((ele, index) => {
                                return (
                                    <NavItem
                                        key={index + ele.organization.id}
                                        organization={ele.organization}
                                        isExpanded={expanded[ele.organization.id]}
                                        isActive={activeOrg.id === ele.organization.id}
                                        onExpand={onExpand}
                                    />
                                )
                            })}
                        </Accordion>
                    </div>
            }

        </React.Fragment>
    )
}

export default SideBar