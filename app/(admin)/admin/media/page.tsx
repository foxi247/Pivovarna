import { prisma } from '@/lib/db'
import { formatFileSize, formatDateRelative } from '@/lib/utils'
import { Upload, Trash2 } from 'lucide-react'

export default async function AdminMediaPage() {
  const files = await prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

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

      {files.length === 0 ? (
        <div className="bg-white border border-admin-border rounded-xl py-12 text-center text-admin-text-muted">
          Файлов пока нет
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white border border-admin-border rounded-xl overflow-hidden hover:shadow-admin-md transition-shadow cursor-pointer"
            >
              <div className="aspect-square bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.thumbUrl || file.url}
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-admin-text text-[10px] font-medium truncate">{file.originalName}</p>
                <p className="text-admin-text-muted text-[10px]">{formatFileSize(file.size)}</p>
              </div>
              {/* Hover: copy URL + delete */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => navigator.clipboard.writeText(file.url).then(() => {})}
                  className="w-full py-1.5 bg-white text-stone-900 rounded-md text-[10px] font-medium hover:bg-stone-100 transition-colors"
                >
                  Скопировать URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
