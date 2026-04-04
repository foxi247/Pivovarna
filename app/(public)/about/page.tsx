import { prisma } from '@/lib/db'
import { HeroSection } from '@/components/public/sections/HeroSection'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { ProductsSection } from '@/components/public/sections/ProductsSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { NewsSection } from '@/components/public/sections/NewsSection'
import { GallerySection } from '@/components/public/sections/GallerySection'
import { ContactsSection } from '@/components/public/sections/ContactsSection'

export default async function HomePage() {
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
  
  const companyInfo = await prisma.companyInfo.findFirst()
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
    take: 8
  })
  
  const mainPerson = await prisma.teamPerson.findFirst({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' }
  })
  
  const news = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 3
  })
  
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6
  })

  // Безопасная подготовка данных
  const safeCompanyInfo = companyInfo ? {
    ...companyInfo,
    stats: Array.isArray(companyInfo.stats) ? companyInfo.stats : []
  } : null

  return (
    <main>
      <HeroSection slide={slides[0] as any || null} />
      <AboutSection info={safeCompanyInfo as any} />
      <ProductsSection products={products as any} />
      <TeamSection person={mainPerson as any} />
      <NewsSection articles={news as any} />
      <GallerySection items={galleryItems as any} />
      <ContactsSection />
    </main>
  )
}
