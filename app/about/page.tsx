import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"

export const metadata = {
  title: "Про нас - BlackCoffee",
  description: "Дізнайтеся більше про BlackCoffee - вашого надійного партнера у світі якісної кави.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
