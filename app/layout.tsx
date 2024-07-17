import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
import ClerkProvider from "@/providers/ClerkProvider";

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

      <body className={cn('dark:bg-gray-800', inter.className)}>
        <ThemeProvider>
          <ClerkProvider >
            {children}
          </ClerkProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
