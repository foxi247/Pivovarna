export const dynamic = 'force-dynamic'

import nextDynamic from 'next/dynamic'
import { getHeroSlides, getCompanyInfo, getTeamPersons, getSiteSettings, getGalleryItems } from '@/lib/services/settings.service'
import { getProducts } from '@/lib/services/products.service'
import { getNewsArticles } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

const HeroSection = nextDynamic(() => import('@/components/public/sections/HeroSection').then(m => ({ default: m.HeroSection })), { ssr: false })
const AboutSection = nextDynamic(() => import('@/components/public/sections/AboutSection').then(m => ({ default: m.AboutSection })), { ssr: false })
const TeamSection = nextDynamic(() => import('@/components/public/sections/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false })
const ProductsSection = nextDynamic(() => import('@/components/public/sections/ProductsSection').then(m => ({ default: m.ProductsSection })), { ssr: false })
const NewsSection = nextDynamic(() => import('@/components/public/sections/NewsSection').then(m => ({ default: m.NewsSection })), { ssr: false })
const GallerySection = nextDynamic(() => import('@/components/public/sections/GallerySection').then(m => ({ default: m.GallerySection })), { ssr: false })
const ContactsSection = nextDynamic(() => import('@/components/public/sections/ContactsSection').then(m => ({ default: m.ContactsSection })), { ssr: false })

// Fallback order when no DB sections exist
const DEFAULT_ORDER = ['HERO', 'ABOUT_BRIEF', 'TEAM_PERSON', 'PRODUCTS', 'NEWS', 'GALLERY', 'CONTACTS_CTA']

export default async function HomePage() {
  const [heroSlides, companyInfo, teamPersons, products, newsArticles, galleryItems, siteSettings, dbSections] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getCompanyInfo().catch(() => null),
      getTeamPersons().catch(() => []),
      getProducts(undefined, true).catch(() => []),
      getNewsArticles(true, 6).catch(() => []),
      getGalleryItems(undefined, true).catch(() => []),
      getSiteSettings().catch(() => null),
      prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []),
    ])

  // Build ordered list of visible section keys
  const sectionOrder: string[] =
    dbSections.length > 0
      ? dbSections.filter(s => s.isVisible).map(s => s.key)
      : DEFAULT_ORDER

  const sectionMap: Record<string, React.ReactNode> = {
    HERO: <HeroSection slides={heroSlides || []} />,
    ABOUT_BRIEF: <AboutSection info={companyInfo} />,
    TEAM_PERSON: teamPersons?.[0] ? <TeamSection person={teamPersons[0]} /> : null,
    PRODUCTS: <ProductsSection products={products || []} />,
    NEWS: <NewsSection articles={newsArticles || []} />,
    GALLERY: <GallerySection items={galleryItems || []} />,
    CONTACTS_CTA: <ContactsSection settings={siteSettings} />,
  }

  return (
    <>
      {sectionOrder.map(key => {
        const node = sectionMap[key]
        return node ? <div key={key}>{node}</div> : null
      })}
    </>
  )
}
