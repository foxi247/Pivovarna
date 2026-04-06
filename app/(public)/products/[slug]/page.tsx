import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/services/products.service'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? (product.description ?? '').slice(0, 160),
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product || !product.isActive) notFound()

  const specs = [
    product.alcoholContent && { label: 'Крепость', value: `${product.alcoholContent}%` },
    product.bitterness && { label: 'Горечь', value: `${product.bitterness} IBU` },
    product.density && { label: 'Плотность', value: `${product.density}°` },
    product.color && { label: 'Тип', value: product.color },
    product.volume && { label: 'Объём', value: product.volume },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[#7A6C5E] hover:text-[#C8873A] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Вернуться к продукции
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-[#231F1A] aspect-square">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">🍺</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-[#C8873A] text-xs font-semibold tracking-widest uppercase hover:underline"
              >
                {product.category.name}
              </Link>
              {product.isNew && (
                <span className="bg-[#C8873A] text-[#0F0D0A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Новинка
                </span>
              )}
              {product.isPopular && (
                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Хит
                </span>
              )}
            </div>

            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mb-4">
              {product.name}
            </h1>

            <p className="text-[#B8A898] leading-relaxed mb-8">{product.description}</p>

            {/* Specs */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-[#231F1A] border border-[#3D352B] rounded-lg p-4 text-center">
                    <p className="font-display text-[#C8873A] text-2xl font-bold">{spec.value}</p>
                    <p className="text-[#7A6C5E] text-xs mt-1 uppercase tracking-wider">{spec.label}</p>
                  </div>
                ))}
              </div>
            )}

            {product.ingredients && (
              <div className="bg-[#1A1712] border border-[#3D352B] rounded-xl p-5 mb-8">
                <h3 className="text-[#F5EFE6] font-semibold mb-2 text-sm uppercase tracking-wider">
                  Состав
                </h3>
                <p className="text-[#7A6C5E] text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            <Link
              href="/cooperation"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] font-semibold rounded-md transition-all duration-200"
            >
              Оформить заявку на поставку
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
