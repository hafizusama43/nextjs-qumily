import { OrganizationProfile } from '@clerk/nextjs'
import React from 'react'

const OrgSettings = () => {
    return (
        <div className='w-full'>
            <OrganizationProfile appearance={{}} />
        </div>
    )
}

export default OrgSettings