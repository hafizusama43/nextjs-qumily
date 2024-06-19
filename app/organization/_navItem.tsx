import React from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Activity, Banknote, Layout, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface organizationProps {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string;
  hasImage: boolean;
  membersCount: number;
  pendingInvitationsCount: number;
  publicMetadata: OrganizationPublicMetadata;
  adminDeleteEnabled: boolean;
  maxAllowedMemberships: number;
  createdAt: Date;
  updatedAt: Date;
}

interface NavItemProps {
  organization: organizationProps;
  isExpanded: boolean;
  isActive: boolean;
  onExpand: (id: string) => void
}

const NavItem = ({ organization, isActive, isExpanded, onExpand }: NavItemProps) => {

  const pathname = usePathname();

  const router = [
    {
      label: "Board",
      icon: <Layout />,
      href: `/organization/${organization.id}/board`
    },
    {
      label: "Activity",
      icon: <Activity />,
      href: `/organization/${organization.id}/activity`
    },
    {
      label: "Settings",
      icon: <Settings />,
      href: `/organization/${organization.id}/settings`
    },
    {
      label: "Billing",
      icon: <Banknote />,
      href: `/organization/${organization.id}/billing`
    }
  ]

  return (
    <AccordionItem className='border-none' value={organization.id}>
      <AccordionTrigger
        className={cn("flex gap-x-3 text-start p-2 transition text-neutral-600 rounded-lg mt-2 mr-0 md:mr-2 hover:no-underline no-underline hover:bg-neutral-200", isActive && !isExpanded && " bg-neutral-200", isExpanded && "bg-sky-100")}
        onClick={() => onExpand(organization.id)}
      >
        <div className='flex gap-2 items-center'>
          <Image
            height="30"
            width="30"
            className='rounded-full'
            src={organization.imageUrl}
            alt={organization.name}
          ></Image>
          <span className='no-underline'>{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className='mr-2 rounded-lg'>
        {router.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.href}
              className={cn('flex gap-2 my-1 hover:bg-neutral-200 p-3 rounded-lg', pathname.includes(item.href) && 'bg-sky-50')}
            >
              {item.icon} &nbsp; {item.label}
            </Link>
          )
        })}
      </AccordionContent>
    </AccordionItem >
  )
}

export default NavItem