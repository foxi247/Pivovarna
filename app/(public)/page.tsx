export const dynamic = 'force-dynamic'

import nextDynamic from 'next/dynamic'
import { getHeroSlides, getCompanyInfo, getTeamPersons, getSiteSettings, getGalleryItems } from '@/lib/services/settings.service'
import { getProducts } from '@/lib/services/products.service'
import { getNewsArticles } from '@/lib/services/news.service'

const HeroSection = nextDynamic(() => import('@/components/public/sections/HeroSection').then(m => ({ default: m.HeroSection })), { ssr: false })
const AboutSection = nextDynamic(() => import('@/components/public/sections/AboutSection').then(m => ({ default: m.AboutSection })), { ssr: false })
const TeamSection = nextDynamic(() => import('@/components/public/sections/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false })
const ProductsSection = nextDynamic(() => import('@/components/public/sections/ProductsSection').then(m => ({ default: m.ProductsSection })), { ssr: false })
const NewsSection = nextDynamic(() => import('@/components/public/sections/NewsSection').then(m => ({ default: m.NewsSection })), { ssr: false })
const GallerySection = nextDynamic(() => import('@/components/public/sections/GallerySection').then(m => ({ default: m.GallerySection })), { ssr: false })
const ContactsSection = nextDynamic(() => import('@/components/public/sections/ContactsSection').then(m => ({ default: m.ContactsSection })), { ssr: false })

export default async function HomePage() {
  const [heroSlides, companyInfo, teamPersons, products, newsArticles, galleryItems, siteSettings] =
    await Promise.all([
      getHeroSlides().catch(() => []),
      getCompanyInfo().catch(() => null),
      getTeamPersons().catch(() => []),
      getProducts(undefined, true).catch(() => []),
      getNewsArticles(true, 6).catch(() => []),
      getGalleryItems(undefined, true).catch(() => []),
      getSiteSettings().catch(() => null),
    ])

  return (
    <>
      <HeroSection slide={heroSlides?.[0] || null} />
      <AboutSection info={companyInfo} />
      {teamPersons?.[0] && <TeamSection person={teamPersons[0]} />}
      <ProductsSection products={products || []} />
      <NewsSection articles={newsArticles || []} />
      <GallerySection items={galleryItems || []} />
      <ContactsSection settings={siteSettings} />
    </>
  )
}
