import dynamic from 'next/dynamic'
import { getHeroSlides, getCompanyInfo, getTeamPersons, getSiteSettings, getGalleryItems } from '@/lib/services/settings.service'
import { getProducts } from '@/lib/services/products.service'
import { getNewsArticles } from '@/lib/services/news.service'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Дербентская пивоварня — Премиальное пиво из Дагестана',
  description: 'Производитель качественного пива в Дербенте. Традиции пивоварения Дагестана, современные технологии. Оптовые поставки, сотрудничество, экскурсии.',
}

const HeroSection = dynamic(() => import('@/components/public/sections/HeroSection').then(m => ({ default: m.HeroSection })), { ssr: false })
const AboutSection = dynamic(() => import('@/components/public/sections/AboutSection').then(m => ({ default: m.AboutSection })), { ssr: false })
const TeamSection = dynamic(() => import('@/components/public/sections/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false })
const ProductsSection = dynamic(() => import('@/components/public/sections/ProductsSection').then(m => ({ default: m.ProductsSection })), { ssr: false })
const NewsSection = dynamic(() => import('@/components/public/sections/NewsSection').then(m => ({ default: m.NewsSection })), { ssr: false })
const GallerySection = dynamic(() => import('@/components/public/sections/GallerySection').then(m => ({ default: m.GallerySection })), { ssr: false })
const ContactsSection = dynamic(() => import('@/components/public/sections/ContactsSection').then(m => ({ default: m.ContactsSection })), { ssr: false })

export default async function HomePage() {
  const [heroSlides, companyInfo, teamPersons, products, newsArticles, galleryItems, siteSettings] =
    await Promise.all([
      getHeroSlides(),
      getCompanyInfo(),
      getTeamPersons(),
      getProducts(undefined, true),
      getNewsArticles(true, 6),
      getGalleryItems(undefined, true),
      getSiteSettings(),
    ])

  const heroSlide = heroSlides[0] ?? null
  const teamPerson = teamPersons[0] ?? null

  return (
    <>
      <HeroSection slide={heroSlide} />
      <AboutSection info={companyInfo} />
      {teamPerson && <TeamSection person={teamPerson} />}
      <ProductsSection products={products} />
      <NewsSection articles={newsArticles} />
      <GallerySection items={galleryItems} />
      <ContactsSection settings={siteSettings} />
    </>
  )
}
