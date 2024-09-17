"use client"

import Footer from "@/components/ui/footer"
import Navbar from "@/components/ui/navbar"
import TemplatesBreadcrumb from "./_breadcrum"
import clsx from "clsx"
import { useParams, usePathname } from "next/navigation"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className={clsx('pt-20 pt- mb-20 px-5 mx-auto', {
        '': params.slug,
        'max-w-7xl': !params.slug || pathname.includes(`${params.slug}/create-campaign`) || pathname.includes(`campaigns/create/${params.slug}`) || pathname.includes(`campaigns/${params.slug}/edit`)
      })}>
        <TemplatesBreadcrumb />
        {children}
      </main>
      {/* <footer className={clsx('hidden md:block', {
        'hidden': params.slug || pathname.includes(`sign-up`) || pathname.includes(`sign-in`) || pathname.includes(`campaigns`),
      })}>
        <Footer />
      </footer> */}
    </>
  )
}
