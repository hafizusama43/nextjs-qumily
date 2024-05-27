import Footer from "@/components/ui/footer"
import Navbar from "@/components/ui/navbar"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Navbar />
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
