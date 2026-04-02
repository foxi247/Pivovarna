import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Product, ProductCategory } from '@prisma/client'

interface ProductCardProps {
  product: Product & { category: ProductCategory }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        'group block bg-[#231F1A] border border-[#3D352B] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#C8873A]/40 hover:shadow-card-hover',
        className
      )}
    >
      {/* Image */}
      <div className="aspect-square bg-[#2E2820] overflow-hidden relative">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🍺</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-[#C8873A] text-[#0F0D0A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Новинка
            </span>
          )}
          {product.isPopular && (
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Хит
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Сезон
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#7A6C5E] text-[10px] tracking-widest uppercase mb-1">
          {product.category.name}
        </p>
        <h3 className="font-display text-[#F5EFE6] font-semibold text-lg leading-tight mb-2 group-hover:text-[#C8873A] transition-colors">
          {product.name}
        </h3>
        <p className="text-[#7A6C5E] text-sm line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Specs */}
        <div className="flex gap-3 flex-wrap">
          {product.alcoholContent && (
            <div className="text-center">
              <p className="text-[#C8873A] text-sm font-bold">{product.alcoholContent}%</p>
              <p className="text-[#7A6C5E] text-[10px]">Алк.</p>
            </div>
          )}
          {product.bitterness && (
            <div className="text-center">
              <p className="text-[#C8873A] text-sm font-bold">{product.bitterness}</p>
              <p className="text-[#7A6C5E] text-[10px]">IBU</p>
            </div>
          )}
          {product.density && (
            <div className="text-center">
              <p className="text-[#C8873A] text-sm font-bold">{product.density}°</p>
              <p className="text-[#7A6C5E] text-[10px]">Плотн.</p>
            </div>
          )}
          {product.color && (
            <div className="text-center">
              <p className="text-[#F5EFE6] text-sm font-medium">{product.color}</p>
              <p className="text-[#7A6C5E] text-[10px]">Тип</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
