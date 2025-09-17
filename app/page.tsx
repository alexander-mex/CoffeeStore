import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  )
}
