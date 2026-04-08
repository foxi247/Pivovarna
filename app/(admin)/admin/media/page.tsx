import { prisma } from '@/lib/db'
import { Upload } from 'lucide-react'
import { MediaGrid } from '@/components/admin/media/MediaGrid'

export default async function AdminMediaPage() {
  const files = await prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  }).catch(() => [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Медиафайлы</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{files.length} файлов</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors cursor-pointer">
          <Upload size={16} />
          Загрузить файл
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      {/* Upload zone */}
      <div className="border-2 border-dashed border-admin-border rounded-xl p-10 mb-6 text-center hover:border-stone-400 transition-colors cursor-pointer">
        <Upload size={28} className="text-stone-300 mx-auto mb-3" />
        <p className="text-admin-text-muted text-sm">Перетащите изображения сюда или нажмите для выбора</p>
        <p className="text-admin-text-muted text-xs mt-1">JPG, PNG, WebP до 10 МБ</p>
      </div>

      <MediaGrid files={files} />
    </div>
  )
}
