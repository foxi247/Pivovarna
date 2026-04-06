import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' })

export const metadata = {
  title: 'Дербентская пивоварня',
  description: 'Премиальное пиво из сердца Дагестана',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0F0D0A] text-[#F5EFE6] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
