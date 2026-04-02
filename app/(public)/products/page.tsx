import { getProducts, getProductCategories } from '@/lib/services/products.service'
import { ProductCard } from '@/components/public/products/ProductCard'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Продукция',
  description: 'Полный каталог пива Дербентской пивоварни. Светлые, тёмные, нефильтрованные и сезонные сорта.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category),
    getProductCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
            Каталог
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">
            Наша продукция
          </h1>
          <p className="text-[#B8A898] mt-3 max-w-xl">
            Каждый сорт создаётся с особым вниманием к качеству ингредиентов и технологии производства
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="/products"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchParams.category
                  ? 'bg-[#C8873A] text-[#0F0D0A]'
                  : 'bg-[#231F1A] text-[#B8A898] hover:text-[#F5EFE6] border border-[#3D352B]'
              }`}
            >
              Все сорта
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchParams.category === cat.slug
                    ? 'bg-[#C8873A] text-[#0F0D0A]'
                    : 'bg-[#231F1A] text-[#B8A898] hover:text-[#F5EFE6] border border-[#3D352B]'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-[#4D4438]">
            <p className="text-lg">Продукция в выбранной категории не найдена</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
