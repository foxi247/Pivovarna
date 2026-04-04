import { prisma } from '@/lib/db'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { TeamSection } from '@/components/public/sections/TeamSection'
import { GallerySection } from '@/components/public/sections/GallerySection'

export default async function AboutPage() {
  const companyInfo = await prisma.companyInfo.findFirst()
  const team = await prisma.teamPerson.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' }
  })
  
  // Безопасное извлечение статистики
  const stats = companyInfo?.stats && typeof companyInfo.stats === 'object' 
    ? Object.entries(companyInfo.stats as Record<string, number>).map(([key, value]) => ({
        label: key === 'years' ? 'Лет опыта' : 
               key === 'sorts' ? 'Сортов пива' : 
               key === 'employees' ? 'Сотрудников' : 
               key === 'litersPerYear' ? 'Литров в год' : key,
        value: value.toLocaleString()
      }))
    : []

  return (
    <main className="pt-20">
      <AboutSection 
        title={companyInfo?.historyTitle || 'О нашей пивоварне'}
        text={companyInfo?.historyText || ''}
        imageUrl={companyInfo?.historyImageUrl || ''}
        stats={stats}
      />
      
      {companyInfo?.productionText && (
        <AboutSection 
          title={companyInfo.productionTitle || 'Наше производство'}
          text={companyInfo.productionText}
          imageUrl={companyInfo.productionImageUrl || ''}
          reverse
        />
      )}

      <TeamSection team={team} />
      <GallerySection />
    </main>
  )
}
