import React from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
  return (
    <AccordionItem className='border-none' value={organization.id}>
      <AccordionTrigger
        className={cn("flex gap-x-3 text-start p-2 transition text-neutral-600 rounded-lg my-1 mr-2 hover:no-underline no-underline hover:bg-neutral-200", isActive && " bg-neutral-200")}
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
      <AccordionContent>
        <p>adadasd</p>
        <p>adadasd</p>
      </AccordionContent>
    </AccordionItem >
  )
}

export default NavItem