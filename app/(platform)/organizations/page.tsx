import React from 'react'
import { OrganizationList } from "@clerk/nextjs";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organizations',
    description: 'All you organizations in one place',
};

const page = () => {
    return (
        <div className='flex justify-center items-center flex-col'>
            <OrganizationList
                hidePersonal
                afterCreateOrganizationUrl={"/organization/:id"}
                afterSelectOrganizationUrl={"/organization/:id"}
            ></OrganizationList>
        </div>
    )
}

export default page
