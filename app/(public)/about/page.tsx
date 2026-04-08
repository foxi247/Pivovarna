export const dynamic = 'force-dynamic'

import nextDynamic from 'next/dynamic'
import { getCompanyInfo, getTeamPersons, getGalleryItems } from '@/lib/services/settings.service'
import { prisma } from '@/lib/db'
import { EmployeesSection } from '@/components/public/sections/EmployeesSection'

export const dynamic = 'force-dynamic'

const AboutSection = nextDynamic(() => import('@/components/public/sections/AboutSection').then(m => ({ default: m.AboutSection })), { ssr: false })
const TeamSection = nextDynamic(() => import('@/components/public/sections/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false })
const GallerySection = nextDynamic(() => import('@/components/public/sections/GallerySection').then(m => ({ default: m.GallerySection })), { ssr: false })

export default async function AboutPage() {
  const [companyInfo, teamPersons, galleryItems, employees] = await Promise.all([
    getCompanyInfo().catch(() => null),
    getTeamPersons().catch(() => []),
    getGalleryItems(undefined, true).catch(() => []),
    prisma.employee.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    }).catch(() => []),
  ])

  const mainPerson = teamPersons?.[0] ?? null

  return (
    <main className="pt-20">
      <AboutSection info={companyInfo} />
      <TeamSection person={mainPerson} />
      {employees.length > 0 && <EmployeesSection employees={employees} />}
      <GallerySection items={galleryItems || []} />
    </main>
  )
}
