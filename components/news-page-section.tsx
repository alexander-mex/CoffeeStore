"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Image from "next/image"

interface NewsItem {
  id: string
  title: { uk: string; en: string }
  excerpt: { uk: string; en: string }
  content: { uk: string; en: string }
  image: string
  author: string
  publishedAt: string
  category: string
  featured: boolean
}

export function NewsPageSection() {
  const { language } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Симуляція завантаження новин
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: {
          uk: "Нова колекція кави з Ефіопії вже в продажу!",
          en: "New Ethiopian coffee collection now available!",
        },
        excerpt: {
          uk: "Відкрийте для себе унікальні смаки високогірної кави з регіону Сідамо",
          en: "Discover the unique flavors of highland coffee from the Sidamo region",
        },
        content: {
          uk: "Ми раді представити нашу нову колекцію кави з Ефіопії! Ці зерна вирощені на висоті понад 2000 метрів над рівнем моря в регіоні Сідамо, що надає їм неповторний фруктовий смак з нотками цитрусових та квітів. Наші партнери-фермери використовують традиційні методи обробки, що передаються з покоління в покоління.",
          en: "We are excited to introduce our new Ethiopian coffee collection! These beans are grown at an altitude of over 2000 meters above sea level in the Sidamo region, giving them a unique fruity flavor with notes of citrus and flowers. Our partner farmers use traditional processing methods passed down from generation to generation.",
        },
        image: "/placeholder.svg?height=400&width=600",
        author: "Олександр Коваленко",
        publishedAt: "2024-01-15",
        category: "products",
        featured: true,
      },
      {
        id: "2",
        title: {
          uk: 'BlackCoffee отримав нагороду "Кращий обжарювач року"',
          en: 'BlackCoffee wins "Best Roaster of the Year" award',
        },
        excerpt: {
          uk: "На міжнародному конкурсі кави в Амстердамі наша команда здобула престижну нагороду",
          en: "At the international coffee competition in Amsterdam, our team won a prestigious award",
        },
        content: {
          uk: 'Ми пишаємося тим, що BlackCoffee було визнано "Кращим обжарювачем року" на престижному міжнародному конкурсі кави в Амстердамі. Це визнання нашої постійної роботи над удосконаленням процесу обжарювання та створенням унікальних смакових профілів. Дякуємо всім нашим клієнтам за підтримку!',
          en: 'We are proud that BlackCoffee has been recognized as "Best Roaster of the Year" at the prestigious international coffee competition in Amsterdam. This is recognition of our constant work on improving the roasting process and creating unique flavor profiles. Thank you to all our customers for your support!',
        },
        image: "/placeholder.svg?height=400&width=600",
        author: "Марія Петренко",
        publishedAt: "2024-01-10",
        category: "awards",
        featured: false,
      },
      {
        id: "3",
        title: {
          uk: "Майстер-клас з приготування кави вдома",
          en: "Home coffee brewing masterclass",
        },
        excerpt: {
          uk: "Приєднуйтесь до нашого безкоштовного онлайн майстер-класу 25 січня",
          en: "Join our free online masterclass on January 25th",
        },
        content: {
          uk: "25 січня о 19:00 ми проводимо безкоштовний онлайн майстер-клас з приготування кави вдома. Наш головний бариста Дмитро Іваненко розповість про різні методи заварювання, поділиться секретами ідеальної екстракції та відповість на всі ваші запитання. Реєстрація обов'язкова!",
          en: "On January 25th at 7:00 PM we are hosting a free online masterclass on home coffee brewing. Our head barista Dmytro Ivanenko will talk about different brewing methods, share secrets of perfect extraction and answer all your questions. Registration required!",
        },
        image: "/placeholder.svg?height=400&width=600",
        author: "Дмитро Іваненко",
        publishedAt: "2024-01-08",
        category: "events",
        featured: false,
      },
    ]

    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      products: { uk: "Продукти", en: "Products" },
      awards: { uk: "Нагороди", en: "Awards" },
      events: { uk: "Події", en: "Events" },
      company: { uk: "Компанія", en: "Company" },
    }
    return labels[category as keyof typeof labels]?.[language] || category
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
            <p className="mt-4 text-coffee-600">{language === "uk" ? "Завантаження новин..." : "Loading news..."}</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredNews = news.find((item) => item.featured)
  const regularNews = news.filter((item) => !item.featured)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Новини BlackCoffee" : "BlackCoffee News"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Будьте в курсі останніх новин, подій та оновлень від нашої команди"
              : "Stay updated with the latest news, events and updates from our team"}
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredNews.image || "/placeholder.svg"}
                    alt={featuredNews.title[language]}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-coffee-600 hover:bg-coffee-700">
                      {language === "uk" ? "Головна новина" : "Featured"}
                    </Badge>
                    <Badge variant="outline">{getCategoryLabel(featuredNews.category)}</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-coffee-800 mb-4 font-serif">
                    {featuredNews.title[language]}
                  </h2>
                  <p className="text-coffee-600 mb-6 leading-relaxed">{featuredNews.excerpt[language]}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredNews.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredNews.publishedAt)}</span>
                    </div>
                  </div>
                  <Button className="bg-coffee-600 hover:bg-coffee-700">
                    {language === "uk" ? "Читати повністю" : "Read More"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title[language]}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-coffee-800 mb-3 line-clamp-2 font-serif">
                    {item.title[language]}
                  </h3>
                  <p className="text-coffee-600 mb-4 line-clamp-3">{item.excerpt[language]}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full bg-transparent">
                  {language === "uk" ? "Читати далі" : "Read More"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {language === "uk" ? "Завантажити більше новин" : "Load More News"}
          </Button>
        </div>
      </div>
    </section>
  )
}
