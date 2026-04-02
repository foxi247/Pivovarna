import Link from 'next/link'
import { AnimatedSection, StaggerContainer, staggerItem } from '@/components/public/ui/AnimatedSection'
import { ProductCard } from '@/components/public/products/ProductCard'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product, ProductCategory } from '@prisma/client'

interface ProductsSectionProps {
  products: (Product & { category: ProductCategory })[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section id="products" className="py-28 bg-[#0F0D0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <AnimatedSection>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                Наши сорта
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mt-3 leading-tight">
                Продукция пивоварни
              </h2>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[#C8873A] hover:text-[#E8A855] text-sm font-semibold transition-colors group"
            >
              Все сорта
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 text-[#4D4438]">
            Продукция скоро появится
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.slice(0, 8).map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  )
}
