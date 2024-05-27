import { Button } from '@/components/ui/button'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const pages = async () => {
    const user = await currentUser();
    return (
        <div>
            Protected
            User {user?.fullName}
            {/* Email {user?.emailAddresses} */}
            {/* <Button onClick={() => { console.log('User') }}>Get User</Button> */}
        </div>
    )
}

export default pages
