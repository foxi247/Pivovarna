import dynamic from 'next/dynamic'
import { getCompanyInfo, getTeamPersons, getGalleryItems } from '@/lib/services/settings.service'

// ПРАВИЛЬНАЯ НАСТРОЙКА: заставляем страницу рендериться только при запросе
export const dynamic = 'force-dynamic'

const AboutSection = dynamic(() => import('@/components/public/sections/AboutSection').then(m => ({ default: m.AboutSection })), { ssr: false })
const TeamSection = dynamic(() => import('@/components/public/sections/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false })
const GallerySection = dynamic(() => import('@/components/public/sections/GallerySection').then(m => ({ default: m.GallerySection })), { ssr: false })

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
