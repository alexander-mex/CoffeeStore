import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactsSection } from "@/components/contacts-section"

export const metadata = {
  title: "Контакти - BlackCoffee",
  description: "Зв'яжіться з нами. Адреса, телефон, email та форма зворотного зв'язку.",
}

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ContactsSection />
      </main>
      <Footer />
    </div>
  )
}
