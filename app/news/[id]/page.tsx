import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsDetailSection } from "@/components/news-detail-section"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Новина - BlackCoffee`,
    description: "Детальна інформація про новину BlackCoffee",
  }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <NewsDetailSection newsId={id} />
      </main>
      <Footer />
    </div>
  )
}
