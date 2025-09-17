import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DeliverySection } from "@/components/delivery-section"

export const metadata = {
  title: "Доставка - BlackCoffee",
  description: "Умови доставки BlackCoffee. Доставка по Україні, Києву та самовивіз.",
}

export default function DeliveryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <DeliverySection />
      </main>
      <Footer />
    </div>
  )
}
