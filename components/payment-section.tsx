"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Banknote, Shield, Clock, CheckCircle } from "lucide-react"

export function PaymentSection() {
  const { language } = useLanguage()

  const paymentMethods = [
    {
      id: "cards",
      icon: CreditCard,
      title: { uk: "Банківські карти", en: "Bank Cards" },
      description: {
        uk: "Visa, MasterCard, American Express",
        en: "Visa, MasterCard, American Express",
      },
      features: [
        { uk: "Миттєва оплата", en: "Instant payment" },
        { uk: "Безпечні транзакції", en: "Secure transactions" },
        { uk: "3D Secure захист", en: "3D Secure protection" },
      ],
      popular: true,
    },
    {
      id: "online",
      icon: Smartphone,
      title: { uk: "Онлайн платежі", en: "Online Payments" },
      description: {
        uk: "Apple Pay, Google Pay, PayPal",
        en: "Apple Pay, Google Pay, PayPal",
      },
      features: [
        { uk: "Швидка оплата", en: "Quick payment" },
        { uk: "Без введення даних карти", en: "No card details required" },
        { uk: "Біометрична авторизація", en: "Biometric authorization" },
      ],
      popular: false,
    },
    {
      id: "cash",
      icon: Banknote,
      title: { uk: "Готівка при отриманні", en: "Cash on Delivery" },
      description: {
        uk: "Оплата кур'єру готівкою",
        en: "Cash payment to courier",
      },
      features: [
        { uk: "Оплата при отриманні", en: "Pay on delivery" },
        { uk: "Без передоплати", en: "No prepayment" },
        { uk: "Можливість огляду товару", en: "Product inspection available" },
      ],
      popular: false,
    },
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: { uk: "SSL шифрування", en: "SSL Encryption" },
      description: {
        uk: "Всі платежі захищені 256-бітним SSL шифруванням",
        en: "All payments are protected by 256-bit SSL encryption",
      },
    },
    {
      icon: CheckCircle,
      title: { uk: "PCI DSS сертифікація", en: "PCI DSS Certification" },
      description: {
        uk: "Відповідність міжнародним стандартам безпеки платежів",
        en: "Compliance with international payment security standards",
      },
    },
    {
      icon: Clock,
      title: { uk: "Моніторинг 24/7", en: "24/7 Monitoring" },
      description: {
        uk: "Постійний контроль безпеки всіх транзакцій",
        en: "Continuous security monitoring of all transactions",
      },
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Способи оплати" : "Payment Methods"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Оберіть зручний для вас спосіб оплати. Всі платежі захищені та безпечні."
              : "Choose a convenient payment method for you. All payments are protected and secure."}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              id={method.id}
              className="relative bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              {method.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-coffee-600 hover:bg-coffee-700">
                    {language === "uk" ? "Популярно" : "Popular"}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-coffee-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-coffee-800">{method.title[language]}</CardTitle>
                <p className="text-coffee-600">{method.description[language]}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {method.features.map((feature, index) => (
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

        {/* Security Section */}
        <div className="bg-coffee-50 rounded-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coffee-800 mb-4 font-serif">
              {language === "uk" ? "Безпека платежів" : "Payment Security"}
            </h2>
            <p className="text-coffee-600 max-w-2xl mx-auto">
              {language === "uk"
                ? "Ваша безпека - наш пріоритет. Ми використовуємо найсучасніші технології захисту."
                : "Your security is our priority. We use the most advanced protection technologies."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-coffee-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">{feature.title[language]}</h3>
                <p className="text-coffee-600 text-sm">{feature.description[language]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-coffee-800 mb-8 text-center font-serif">
            {language === "uk" ? "Часті питання" : "Frequently Asked Questions"}
          </h2>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">
                  {language === "uk" ? "Чи безпечно платити картою онлайн?" : "Is it safe to pay by card online?"}
                </h3>
                <p className="text-coffee-600">
                  {language === "uk"
                    ? "Так, абсолютно безпечно. Ми використовуємо SSL шифрування та 3D Secure технологію для захисту ваших даних. Дані вашої карти не зберігаються на наших серверах."
                    : "Yes, absolutely safe. We use SSL encryption and 3D Secure technology to protect your data. Your card data is not stored on our servers."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">
                  {language === "uk" ? "Коли списуються кошти з карти?" : "When is money debited from the card?"}
                </h3>
                <p className="text-coffee-600">
                  {language === "uk"
                    ? "Кошти списуються відразу після підтвердження замовлення. При оплаті готівкою при отриманні - тільки після отримання товару."
                    : "Money is debited immediately after order confirmation. For cash on delivery - only after receiving the goods."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-coffee-800 mb-2">
                  {language === "uk" ? "Чи можна повернути кошти?" : "Is it possible to get a refund?"}
                </h3>
                <p className="text-coffee-600">
                  {language === "uk"
                    ? "Так, ви можете повернути товар протягом 14 днів. Кошти повертаються тим же способом, яким була здійснена оплата, протягом 3-5 робочих днів."
                    : "Yes, you can return the product within 14 days. Money is refunded in the same way the payment was made, within 3-5 business days."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}