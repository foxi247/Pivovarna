import { getProducts, getProductCategories } from '@/lib/services/products.service'
import { ProductsWithFilter } from '@/components/public/products/ProductsWithFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Продукция',
  description: 'Полный каталог пива Дербентской пивоварни. Светлые, тёмные, нефильтрованные и сезонные сорта.',
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Каталог</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">
            Наша продукция
          </h1>
          <p className="text-[#B8A898] mt-3 max-w-xl">
            Каждый сорт создаётся с особым вниманием к качеству ингредиентов и технологии производства
          </p>
        </div>

        <ProductsWithFilter products={products} categories={categories} />
      </div>
    </div>
  )
}
