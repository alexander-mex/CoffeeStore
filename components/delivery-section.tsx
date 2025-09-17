"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Clock, Package, Star, CheckCircle } from "lucide-react"

export function DeliverySection() {
  const { language } = useLanguage()

  const deliveryOptions = [
    {
      id: "kyiv",
      icon: MapPin,
      title: { uk: "Доставка по Києву", en: "Kyiv Delivery" },
      price: { uk: "Від 50 грн", en: "From 50 UAH" },
      time: { uk: "1-2 дні", en: "1-2 days" },
      description: {
        uk: "Швидка доставка кур'єром по всьому Києву",
        en: "Fast courier delivery throughout Kyiv",
      },
      features: [
        { uk: "Доставка до дверей", en: "Door-to-door delivery" },
        { uk: "Зручний час доставки", en: "Convenient delivery time" },
        { uk: "SMS повідомлення", en: "SMS notifications" },
      ],
      popular: true,
    },
    {
      id: "ukraine",
      icon: Truck,
      title: { uk: "Доставка по Україні", en: "Ukraine-wide Delivery" },
      price: { uk: "Від 80 грн", en: "From 80 UAH" },
      time: { uk: "2-5 днів", en: "2-5 days" },
      description: {
        uk: "Доставка Новою Поштою та Укрпоштою",
        en: "Delivery by Nova Poshta and Ukrposhta",
      },
      features: [
        { uk: "Відділення та поштомати", en: "Branches and post offices" },
        { uk: "Адресна доставка", en: "Address delivery" },
        { uk: "Відстеження посилки", en: "Package tracking" },
      ],
      popular: false,
    },
    {
      id: "pickup",
      icon: Package,
      title: { uk: "Самовивіз", en: "Pickup" },
      price: { uk: "Безкоштовно", en: "Free" },
      time: { uk: "Сьогодні", en: "Today" },
      description: {
        uk: "Забирайте замовлення з нашого магазину",
        en: "Pick up orders from our store",
      },
      features: [
        { uk: "Без вартості доставки", en: "No delivery cost" },
        { uk: "Готовність за 2 години", en: "Ready in 2 hours" },
        { uk: "Консультація при отриманні", en: "Consultation on pickup" },
      ],
      popular: false,
    },
  ]

  const deliveryZones = [
    {
      zone: { uk: "Центр Києва", en: "Kyiv Center" },
      price: { uk: "50 грн", en: "50 UAH" },
      time: { uk: "1 день", en: "1 day" },
    },
    {
      zone: { uk: "Київ (інші райони)", en: "Kyiv (other districts)" },
      price: { uk: "70 грн", en: "70 UAH" },
      time: { uk: "1-2 дні", en: "1-2 days" },
    },
    {
      zone: { uk: "Київська область", en: "Kyiv Region" },
      price: { uk: "100 грн", en: "100 UAH" },
      time: { uk: "2-3 дні", en: "2-3 days" },
    },
    {
      zone: { uk: "Великі міста України", en: "Major Ukrainian Cities" },
      price: { uk: "80 грн", en: "80 UAH" },
      time: { uk: "2-4 дні", en: "2-4 days" },
    },
    {
      zone: { uk: "Інші міста України", en: "Other Ukrainian Cities" },
      price: { uk: "120 грн", en: "120 UAH" },
      time: { uk: "3-5 днів", en: "3-5 days" },
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Доставка та отримання" : "Delivery and Pickup"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Оберіть зручний спосіб отримання вашого замовлення. Швидко, надійно, з турботою про якість."
              : "Choose a convenient way to receive your order. Fast, reliable, with care for quality."}
          </p>
        </div>

        {/* Delivery Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {deliveryOptions.map((option) => (
            <Card
              key={option.id}
              id={option.id}
              className="relative bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-coffee-600 hover:bg-coffee-700">
                    {language === "uk" ? "Популярно" : "Popular"}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="h-8 w-8 text-coffee-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-coffee-800">{option.title[language]}</CardTitle>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="text-coffee-600">{option.price[language]}</span>
                  <span className="text-coffee-500">•</span>
                  <span className="text-coffee-600">{option.time[language]}</span>
                </div>
                <p className="text-coffee-600 text-sm">{option.description[language]}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-coffee-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature[language]}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Zones */}
        <div className="bg-coffee-50 rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coffee-800 mb-4 font-serif">
              {language === "uk" ? "Зони доставки та тарифи" : "Delivery Zones and Rates"}
            </h2>
            <p className="text-coffee-600">
              {language === "uk"
                ? "Детальна інформація про вартість та терміни доставки"
                : "Detailed information about delivery costs and terms"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-coffee-200">
                  <th className="text-left p-4 font-semibold text-coffee-800">
                    {language === "uk" ? "Зона доставки" : "Delivery Zone"}
                  </th>
                  <th className="text-left p-4 font-semibold text-coffee-800">
                    {language === "uk" ? "Вартість" : "Cost"}
                  </th>
                  <th className="text-left p-4 font-semibold text-coffee-800">
                    {language === "uk" ? "Термін" : "Time"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="border-b border-coffee-100 hover:bg-coffee-50/50">
                    <td className="p-4 text-coffee-700">{zone.zone[language]}</td>
                    <td className="p-4 text-coffee-700 font-medium">{zone.price[language]}</td>
                    <td className="p-4 text-coffee-600">{zone.time[language]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-coffee-600">
              {language === "uk"
                ? "* Безкоштовна доставка при замовленні від 1000 грн"
                : "* Free delivery for orders over 1000 UAH"}
            </p>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-coffee-800 font-serif flex items-center gap-2">
                <Package className="h-6 w-6" />
                {language === "uk" ? "Пункт самовивозу" : "Pickup Point"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-coffee-600 mt-0.5" />
                <div>
                  <p className="font-medium text-coffee-800">{language === "uk" ? "Адреса:" : "Address:"}</p>
                  <p className="text-coffee-600">
                    {language === "uk" ? "вул. Хрещатик, 22, Київ" : "Khreshchatyk St, 22, Kyiv"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-coffee-600 mt-0.5" />
                <div>
                  <p className="font-medium text-coffee-800">
                    {language === "uk" ? "Години роботи:" : "Working Hours:"}
                  </p>
                  <p className="text-coffee-600">
                    {language === "uk" ? "Пн-Пт: 8:00 - 20:00" : "Mon-Fri: 8:00 - 20:00"}
                  </p>
                  <p className="text-coffee-600">
                    {language === "uk" ? "Сб-Нд: 9:00 - 18:00" : "Sat-Sun: 9:00 - 18:00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-coffee-800 font-serif flex items-center gap-2">
                <Star className="h-6 w-6" />
                {language === "uk" ? "Переваги самовивозу" : "Pickup Benefits"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-coffee-700">
                    {language === "uk" ? "Економія на доставці" : "Save on delivery"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-coffee-700">{language === "uk" ? "Швидке отримання" : "Quick pickup"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-coffee-700">
                    {language === "uk" ? "Консультація спеціаліста" : "Expert consultation"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-coffee-700">{language === "uk" ? "Дегустація кави" : "Coffee tasting"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-coffee-800 mb-8 text-center font-serif">
            {language === "uk" ? "Часті питання про доставку" : "Delivery FAQ"}
          </h2>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">
                  {language === "uk" ? "Як відстежити моє замовлення?" : "How to track my order?"}
                </h3>
                <p className="text-coffee-600">
                  {language === "uk"
                    ? "Після відправки ви отримаєте SMS з номером для відстеження. Також можете перевірити статус в особистому кабінеті."
                    : "After shipping, you will receive an SMS with a tracking number. You can also check the status in your personal account."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">
                  {language === "uk" ? "Що робити, якщо мене не буде вдом��?" : "What if I'm not at home?"}
                </h3>
                <p className="text-coffee-600">
                  {language === "uk"
                    ? "Кур'єр зателефонує за 30 хвилин до доставки. Можна перенести доставку на інший час або залишити замовлення сусідам."
                    : "The courier will call 30 minutes before delivery. You can reschedule delivery or leave the order with neighbors."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}