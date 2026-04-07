import { Header } from '@/components/public/layout/Header'
import { Footer } from '@/components/public/layout/Footer'
import { PageTracker } from '@/components/public/analytics/PageTracker'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F0D0A]">
      <PageTracker />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
