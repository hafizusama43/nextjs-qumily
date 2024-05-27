import Navbar from '@/components/ui/navbar';
import React from 'react'

const OrgLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <main className="mt-140 md:mt-">
            <Navbar org_dashboard></Navbar>
            {children}
        </main>
    )
}

export default OrgLayout