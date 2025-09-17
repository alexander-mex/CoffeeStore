"use client"

import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-coffee-800 mb-8 font-serif">
            {language === "uk" ? "Політика конфіденційності" : "Privacy Policy"}
          </h1>

          <div className="prose prose-coffee max-w-none">
            {language === "uk" ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">1. Збір інформації</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ми збираємо інформацію, яку ви надаєте нам безпосередньо, наприклад, коли ви створюєте обліковий
                    запис, робите покупку або зв'язуєтесь з нами.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">2. Використання інформації</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ми використовуємо зібрану інформацію для обробки замовлень, надання послуг, покращення нашого сайту
                    та зв'язку з вами.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">3. Захист даних</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ми вживаємо відповідних заходів безпеки для захисту вашої особистої інформації від несанкціонованого
                    доступу, зміни або розкриття.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">1. Information Collection</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, make a
                    purchase, or contact us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">2. Use of Information</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    We use the collected information to process orders, provide services, improve our website, and
                    communicate with you.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">3. Data Protection</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    We implement appropriate security measures to protect your personal information from unauthorized
                    access, alteration, or disclosure.
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
