"use client"
import React from 'react'
import { dark, neobrutalism } from '@clerk/themes';
import { ClerkProvider as NextClerkProvider } from "@clerk/nextjs";
import { useTheme } from 'next-themes';
const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
    const { resolvedTheme } = useTheme()
    console.log(resolvedTheme)

    return (
        <NextClerkProvider appearance={{
            baseTheme: resolvedTheme === 'dark' && dark,
            variables: { colorBackground: resolvedTheme === 'dark' ? "rgb(31 41 55 /1)" : "" }
        }}>
            {children}
        </NextClerkProvider >
    )
}

export default ClerkProvider
