"use client"

import Footer from "@/components/ui/footer"
import OrgNavbar from "@/components/ui/OrgNavbar"
import clsx from "clsx"
import { useParams, usePathname } from "next/navigation"
import SideBar from "./_sidebar"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const pathname = usePathname();

    return (
        <>
            <nav>
                <OrgNavbar />
            </nav>
            <main className="px-2 mt-40 md:mt-40 mx-auto max-w-7xl">
                <div className="flex gap-x-7">
                    <aside className="w-64 shrink-0 hidden md:block">
                        <SideBar storageKey={""}></SideBar>
                    </aside>
                    {children}
                </div>
            </main>
            <footer className={clsx('block', {
                'hidden': params.slug || pathname.includes('organization'),
            })}>
                <Footer />
            </footer>
        </>
    )
}
