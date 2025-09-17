"use client"

import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TermsPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-coffee-800 mb-8 font-serif">
            {language === "uk" ? "Умови використання" : "Terms of Service"}
          </h1>

          <div className="prose prose-coffee max-w-none">
            {language === "uk" ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">1. Прийняття умов</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Використовуючи наш сайт, ви погоджуєтесь з цими умовами використання. Якщо ви не згодні з будь-якою
                    частиною цих умов, не використовуйте наш сайт.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">2. Використання сайту</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ви можете використовувати наш сайт для законних цілей і відповідно до цих умов. Заборонено
                    використовувати сайт для незаконної діяльності.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">3. Замовлення та оплата</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Всі замовлення підлягають наявності товару та підтвердженню. Ми залишаємо за собою право відмовити в
                    обробці замовлення.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    By using our website, you agree to these terms of service. If you do not agree with any part of
                    these terms, do not use our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">2. Use of Website</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    You may use our website for lawful purposes and in accordance with these terms. You are prohibited
                    from using the site for illegal activities.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">3. Orders and Payment</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    All orders are subject to availability and confirmation. We reserve the right to refuse processing
                    any order.
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
