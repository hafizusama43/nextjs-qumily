import { auth } from '@clerk/nextjs/server';

import React from 'react'

const Orgpage = ({ }) => {
    const { userId,orgId } = auth()
    return (
        <div>
            Org id  : {orgId}
        </div>
    )
}

export default Orgpage
