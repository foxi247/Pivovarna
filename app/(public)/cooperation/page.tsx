import { LeadForm } from '@/components/public/forms/LeadForm'
import type { LeadFormConfig } from '@/components/public/forms/LeadForm'
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Сотрудничество',
  description: 'Оставьте заявку на сотрудничество с Дербентской пивоварней. Оптовые поставки, дистрибуция, партнёрство.',
}

export default async function CooperationPage() {
  const record = await prisma.pageContent.findUnique({ where: { key: 'form_cooperation' } }).catch(() => null)
  const formCfg = (record?.data ?? {}) as LeadFormConfig

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="bg-[#1A1712] border border-[#3D352B] rounded-2xl p-8 lg:p-12">
          <LeadForm
            type="COOPERATION"
            source="website_cooperation_page"
            title={formCfg.title || 'Стать партнёром'}
            subtitle={formCfg.subtitle || 'Расскажите о вашем предложении — мы свяжемся с вами в течение одного рабочего дня'}
            config={formCfg}
          />
        </div>
      </div>
    </div>
  )
}
