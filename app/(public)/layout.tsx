import { Header } from '@/components/public/layout/Header'
import { Footer } from '@/components/public/layout/Footer'
import { Preloader } from '@/components/public/Preloader'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site">
      <Preloader />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
