import { Header } from '@/components/public/layout/Header'
import { Footer } from '@/components/public/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F0D0A]">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
