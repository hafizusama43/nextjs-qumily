import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.title,
//     template: `%s | ${siteConfig.title}`
//   },
//   description: siteConfig.description,
//   icons: [
//     {
//       url: "/logoNew.png"
//     }
//   ]
// };

export default function BaseLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="mt-[6rem] mb-40 md:mt-40 mx-auto max-w-7xl">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
