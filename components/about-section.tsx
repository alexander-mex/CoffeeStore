"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Heart, Award, Users } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const { language } = useLanguage()

  const features = [
    {
      icon: Coffee,
      title: { uk: "Якісна кава", en: "Quality Coffee" },
      description: {
        uk: "Ми відбираємо тільки найкращі зерна з провідних кавових регіонів світу",
        en: "We select only the finest beans from leading coffee regions worldwide",
      },
    },
    {
      icon: Heart,
      title: { uk: "З любов'ю", en: "With Love" },
      description: {
        uk: "Кожна чашка кави готується з особливою увагою та любов'ю до деталей",
        en: "Every cup of coffee is prepared with special attention and love for details",
      },
    },
    {
      icon: Award,
      title: { uk: "Нагороди", en: "Awards" },
      description: {
        uk: "Наша кава отримала численні нагороди на міжнародних конкурсах",
        en: "Our coffee has received numerous awards at international competitions",
      },
    },
    {
      icon: Users,
      title: { uk: "Спільнота", en: "Community" },
      description: {
        uk: "Ми створюємо спільноту справжніх поціновувачів кави",
        en: "We create a community of true coffee connoisseurs",
      },
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-6 font-serif">
            {language === "uk" ? "Про BlackCoffee" : "About BlackCoffee"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-3xl mx-auto leading-relaxed">
            {language === "uk"
              ? "BlackCoffee - це більше ніж просто магазин кави. Ми - команда пристрасних кавоманів, які присвятили своє життя пошуку та доставці найкращої кави прямо до вашого дому."
              : "BlackCoffee is more than just a coffee shop. We are a team of passionate coffee lovers who have dedicated their lives to finding and delivering the best coffee straight to your home."}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-coffee-800 mb-6 font-serif">
              {language === "uk" ? "Наша історія" : "Our Story"}
            </h2>
            <div className="space-y-4 text-coffee-600">
              <p>
                {language === "uk"
                  ? "Все почалося з простої мрії - поділитися любов'ю до справжньої кави з усім світом. У 2018 році ми відкрили наш перший магазин у серці Києва, і з тих пір наша пристрасть до кави тільки зростає."
                  : "It all started with a simple dream - to share the love of real coffee with the whole world. In 2018, we opened our first store in the heart of Kyiv, and since then our passion for coffee has only grown."}
              </p>
              <p>
                {language === "uk"
                  ? "Сьогодні BlackCoffee - це команда з понад 50 професіоналів, які працюють над тим, щоб кожна чашка кави була ідеальною. Ми співпрацює��о безпосередньо з фермерами з Колумбії, Ефіопії, Бразилії та інших кавових регіонів."
                  : "Today BlackCoffee is a team of over 50 professionals working to make every cup of coffee perfect. We work directly with farmers from Colombia, Ethiopia, Brazil and other coffee regions."}
              </p>
              <p>
                {language === "uk"
                  ? "Наша місія проста - робити світ трохи кращим, одна чашка кави за раз."
                  : "Our mission is simple - to make the world a little better, one cup of coffee at a time."}
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Coffee roasting process"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-coffee-600" />
                </div>
                <h3 className="text-xl font-semibold text-coffee-800 mb-3">{feature.title[language]}</h3>
                <p className="text-coffee-600">{feature.description[language]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-coffee-800 mb-8 font-serif">
            {language === "uk" ? "Наша команда" : "Our Team"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Олександр Коваленко",
                position: { uk: "Засновник і головний обжарювач", en: "Founder & Head Roaster" },
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Марія Петренко",
                position: { uk: "Менеджер з якості", en: "Quality Manager" },
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Дмитро Іваненко",
                position: { uk: "Головний бариста", en: "Head Barista" },
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-coffee-800 mb-2">{member.name}</h3>
                  <p className="text-coffee-600">{member.position[language]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-coffee-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-coffee-800 mb-6 font-serif">
            {language === "uk" ? "Наші цінності" : "Our Values"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">{language === "uk" ? "Якість" : "Quality"}</h3>
              <p className="text-coffee-600">
                {language === "uk"
                  ? "Ми ніколи не йдемо на компроміси в питаннях якості нашої кави"
                  : "We never compromise on the quality of our coffee"}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">
                {language === "uk" ? "Сталість" : "Sustainability"}
              </h3>
              <p className="text-coffee-600">
                {language === "uk"
                  ? "Ми підтримуємо справедливу торгівлю та екологічно чисте виробництво"
                  : "We support fair trade and environmentally friendly production"}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-coffee-800 mb-3">
                {language === "uk" ? "Інновації" : "Innovation"}
              </h3>
              <p className="text-coffee-600">
                {language === "uk"
                  ? "Ми постійно шукаємо нові способи покращити ваш кавовий досвід"
                  : "We are constantly looking for new ways to improve your coffee experience"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}