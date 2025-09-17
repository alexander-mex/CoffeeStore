import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactsSection from "@/components/contacts-section"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <ContactsSection />
      <Footer />
    </div>
  )
}
