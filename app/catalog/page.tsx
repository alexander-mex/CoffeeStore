import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogSection } from "@/components/catalog-section"

export const metadata = {
  title: "Каталог - BlackCoffee",
  description: "Повний каталог зернової та меленої кави. Великий вибір сортів кави з усього світу.",
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CatalogSection />
      </main>
      <Footer />
    </div>
  )
}
