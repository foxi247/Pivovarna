import { prisma } from '@/lib/db'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { GallerySection } from '@/components/public/sections/GallerySection'

export default async function AboutPage() {
  const companyInfo = await prisma.companyInfo.findFirst()
  const mainPerson = await prisma.teamPerson.findFirst({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' }
  })
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6
  })

  return (
    <main className="pt-20">
      <AboutSection info={companyInfo} />
      <TeamSection person={mainPerson} />
      <GallerySection items={galleryItems} />
    </main>
  )
}
