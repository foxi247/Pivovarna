'use client'

import { toast } from 'sonner'
import { formatFileSize, formatDateRelative } from '@/lib/utils'
import type { MediaFile } from '@prisma/client'

interface Props {
  files: MediaFile[]
}

export function MediaGrid({ files }: Props) {
  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL скопирован')
    })
  }

  if (files.length === 0) {
    return (
      <div className="bg-white border border-admin-border rounded-xl py-12 text-center text-admin-text-muted">
        Файлов пока нет
      </div>
    )
  }

  return (
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
          {/* Hover: copy URL */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
            <button
              onClick={() => copyUrl(file.url)}
              className="w-full py-1.5 bg-white text-stone-900 rounded-md text-[10px] font-medium hover:bg-stone-100 transition-colors"
            >
              Скопировать URL
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
