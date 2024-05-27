import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import React from 'react'

const OrgLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <>
            <nav>
                <Navbar org_dashboard></Navbar>
            </nav>
            <main className="mt-40 md:mt-40 mx-auto max-w-7xl">
                {children}
            </main>
        </>
    )
}

export default OrgLayout