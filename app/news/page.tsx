import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsPageSection } from "@/components/news-page-section-final"

export const metadata = {
  title: "Новини - BlackCoffee",
  description: "Останні новини та оновлення від BlackCoffee. Будьте в курсі всіх подій.",
}

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <NewsPageSection />
      </main>
      <Footer />
    </div>
  )
}
