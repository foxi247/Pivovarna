import { getCompanyInfo, getTeamPersons } from '@/lib/services/settings.service'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { GallerySection } from '@/components/public/sections/GallerySection'
import { getGalleryItems } from '@/lib/services/settings.service'

export default async function AboutPage() {
  const [companyInfo, teamPersons, galleryItems] = await Promise.all([
    getCompanyInfo().catch(() => null),
    getTeamPersons().catch(() => []),
    getGalleryItems(undefined, true).catch(() => [])
  ])

  const mainPerson = teamPersons?.[0] ?? null

  return (
    <main className="pt-20">
      <AboutSection info={companyInfo} />
      <TeamSection person={mainPerson} />
      <GallerySection items={galleryItems || []} />
    </main>
  )
}
