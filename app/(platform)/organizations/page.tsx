import React from 'react'
import { OrganizationList } from "@clerk/nextjs";

const page = () => {
    return (
        <div className='flex justify-center items-center flex-col'>
            <OrganizationList hidePersonal afterCreateOrganizationUrl={"/organization/:id"} afterSelectOrganizationUrl={"/organization/:id"}></OrganizationList>
        </div>
    )
}

export default page
