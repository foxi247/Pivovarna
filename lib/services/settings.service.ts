import { prisma } from '@/lib/db'

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst()
  return settings
}

export async function updateSiteSettings(data: {
  siteName?: string
  siteTagline?: string
  logoUrl?: string
  phone?: string
  phoneSecond?: string
  email?: string
  address?: string
  addressMap?: string
  workingHours?: string
  socialVk?: string
  socialTelegram?: string
  socialYoutube?: string
  socialInstagram?: string
  socialWhatsapp?: string
  footerText?: string
  metrikaId?: string
}) {
  const existing = await prisma.siteSettings.findFirst()
  if (existing) {
    return prisma.siteSettings.update({ where: { id: existing.id }, data })
  }
  return prisma.siteSettings.create({ data })
}

export async function getSeoSettings(page: string) {
  return prisma.seoSettings.findUnique({ where: { page } })
}

export async function upsertSeoSettings(page: string, data: {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  noindex?: boolean
}) {
  return prisma.seoSettings.upsert({
    where: { page },
    update: data,
    create: { page, ...data },
  })
}

export async function getAllSeoSettings() {
  return prisma.seoSettings.findMany({ orderBy: { page: 'asc' } })
}

export async function getHomeSections() {
  return prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function updateHomeSections(sections: { id: string; isVisible: boolean; sortOrder: number }[]) {
  await Promise.all(
    sections.map(({ id, isVisible, sortOrder }) =>
      prisma.homeSection.update({ where: { id }, data: { isVisible, sortOrder } })
    )
  )
}

export async function getHeroSlides(activeOnly = true) {
  return prisma.heroSlide.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getCompanyInfo() {
  return prisma.companyInfo.findFirst()
}

export async function updateCompanyInfo(data: {
  foundedYear?: number
  historyTitle?: string
  historyText?: string
  historyImageUrl?: string
  productionTitle?: string
  productionText?: string
  productionImageUrl?: string
  philosophyTitle?: string
  philosophyText?: string
  philosophyImageUrl?: string
  stats?: Record<string, unknown>
}) {
  const existing = await prisma.companyInfo.findFirst()
  if (existing) {
    return prisma.companyInfo.update({ where: { id: existing.id }, data: data as any })
  }
  return prisma.companyInfo.create({
    data: {
      historyText: '',
      productionText: '',
      philosophyText: '',
      ...data,
    } as any,
  })
}

export async function getTeamPersons(visibleOnly = true) {
  return prisma.teamPerson.findMany({
    where: visibleOnly ? { isVisible: true } : undefined,
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getGalleryItems(categorySlug?: string, activeOnly = true) {
  return prisma.galleryItem.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getGalleryCategories(activeOnly = true) {
  return prisma.galleryCategory.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    include: { _count: { select: { items: true } } },
    orderBy: { sortOrder: 'asc' },
  })
}
