import { HeroSection } from '@/components/public/sections/HeroSection'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { ProductsSection } from '@/components/public/sections/ProductsSection'
import { NewsSection } from '@/components/public/sections/NewsSection'
import { GallerySection } from '@/components/public/sections/GallerySection'
import { ContactsSection } from '@/components/public/sections/ContactsSection'
import { getHeroSlides, getCompanyInfo, getTeamPersons, getSiteSettings } from '@/lib/services/settings.service'
import { getProducts } from '@/lib/services/products.service'
import { getNewsArticles } from '@/lib/services/news.service'
import { getGalleryItems } from '@/lib/services/settings.service'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Дербентская пивоварня — Премиальное пиво из Дагестана',
  description: 'Производитель качественного пива в Дербенте. Традиции пивоварения Дагестана, современные технологии. Оптовые поставки, сотрудничество, экскурсии.',
}

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
