'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { Product, ProductCategory } from '@prisma/client'

interface Props {
  products: (Product & { category: ProductCategory })[]
  categories: (ProductCategory & { _count: { products: number } })[]
}

export function ProductsWithFilter({ products, categories }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active ? products.filter((p) => p.category.slug === active) : products

  return (
    <>
      {/* Filter tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActive(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !active
                ? 'bg-[#C8873A] text-[#0F0D0A]'
                : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B] hover:text-[#F5EFE6]'
            }`}
          >
            Все сорта
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat.slug
                  ? 'bg-[#C8873A] text-[#0F0D0A]'
                  : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B] hover:text-[#F5EFE6]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#4D4438]">
          <p className="text-lg">Продукция в выбранной категории не найдена</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
