import { prisma } from '@/lib/db'
import { Header } from '@/components/public/layout/Header'
import { Footer } from '@/components/public/layout/Footer'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.siteSettings.findFirst()

  return (
    <div className="flex flex-col min-h-screen bg-[#0F0D0A]">
      <Header settings={settings as any} />
      <div className="flex-grow">{children}</div>
      <Footer settings={settings as any} />
    </div>
  )
}
