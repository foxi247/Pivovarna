import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await prisma.customPage.findUnique({ where: { slug: params.slug } }).catch(() => null)
  if (!page || !page.isPublished) return {}
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
  }
}

export default async function CustomPageRoute({ params }: Props) {
  const page = await prisma.customPage.findUnique({ where: { slug: params.slug } }).catch(() => null)
  if (!page || !page.isPublished) notFound()

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mb-8">
          {page.title}
        </h1>
        <div
          className="prose prose-invert prose-stone max-w-none text-[#B8A898] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}
