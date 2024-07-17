import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logoNew.png"
    }
  ]
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="fle" suppressHydrationWarning>
      <ClerkProvider>
        <body className={cn('dark:bg-gray-800', inter.className)}>
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
