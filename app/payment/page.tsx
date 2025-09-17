import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PaymentSection } from "@/components/payment-section"

export const metadata = {
  title: "Оплата - BlackCoffee",
  description: "Способи оплати в BlackCoffee. Банківські карти, онлайн платежі, готівка при отриманні.",
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PaymentSection />
      </main>
      <Footer />
    </div>
  )
}
