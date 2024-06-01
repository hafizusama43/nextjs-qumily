"use client"

import Footer from "@/components/ui/footer"
import OrgNavbar from "@/components/ui/OrgNavbar"
import { Toaster } from "@/components/ui/toaster"
import { useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) return;

        console.log('as')
        setActive({
            organization: params.organizationId as string
        })
    }, [params.organizationId, setActive])
    return (
        <>
            <nav>
                <OrgNavbar />
            </nav>
            <main className="mt-40 md:mt-40 mx-auto max-w-7xl">
                {children}
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}
