"use client"

import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CookiesPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold text-coffee-800 mb-8 font-serif">
            {language === "uk" ? "Політика використання файлів cookie" : "Cookie Policy"}
          </h1>

          <div className="prose prose-coffee max-w-none">
            {language === "uk" ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">Що таке файли cookie?</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Файли cookie - це невеликі текстові файли, які зберігаються на вашому пристрої при відвідуванні
                    веб-сайтів. Вони допомагають нам покращити ваш досвід користування сайтом.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">Як ми використовуємо cookie?</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ми використовуємо файли cookie для запам'ятовування ваших налаштувань, аналізу трафіку сайту та
                    покращення функціональності.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">Управління cookie</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Ви можете контролювати та видаляти файли cookie через налаштування вашого браузера. Однак це може
                    вплинути на функціональність сайту.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">What are cookies?</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    Cookies are small text files stored on your device when you visit websites. They help us improve
                    your browsing experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">How we use cookies</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    We use cookies to remember your preferences, analyze website traffic, and improve functionality.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-coffee-700 mb-4">Managing cookies</h2>
                  <p className="text-coffee-600 leading-relaxed">
                    You can control and delete cookies through your browser settings. However, this may affect website
                    functionality.
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
