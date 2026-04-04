import { prisma } from '@/lib/db'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { GallerySection } from '@/components/public/sections/GallerySection'

export default async function AboutPage() {
  const companyInfo = await prisma.companyInfo.findFirst()
  const team = await prisma.teamPerson.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <main className="pt-20">
      <AboutSection info={companyInfo} />
      <TeamSection team={team} />
      <GallerySection />
    </main>
  )
}
