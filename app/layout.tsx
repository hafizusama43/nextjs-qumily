import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo-new.png"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="fle">
      <ClerkProvider>
        <body className={inter.className}>
          <nav>
            <Navbar />
          </nav>
          <main className="mt-40 md:mt-40">
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </body>
      </ClerkProvider>
    </html>
  );
}
