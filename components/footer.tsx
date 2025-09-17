  "use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send, CreditCard, Truck } from "lucide-react"
import { useEffect, useState } from "react"

export default function Footer() {
  const { language } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Використовуємо українську як fallback до моменту монтування
  const currentLanguage = isMounted ? language : "uk"

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
  }

  return (
    <footer className="bg-coffee-50/50 border-t border-coffee-200" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-coffee-600 rounded-full">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M18.5 3H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12.5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM18 19H6V5h12v14z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif text-coffee-800">BlackCoffee</h3>
                <p className="text-xs text-coffee-600">{currentLanguage === "uk" ? "Преміум кава" : "Premium Coffee"}</p>
              </div>
            </div>

            <p className="text-sm text-coffee-600 leading-relaxed">
              {currentLanguage === "uk"
                ? "Ваш надійний партнер у світі якісної кави. Доставляємо найкращі сорти прямо до вашого дому."
                : "Your reliable partner in the world of quality coffee. We deliver the best varieties straight to your home."}
            </p>

            {/* Social Media */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-coffee-300 hover:bg-coffee-100 bg-transparent"
              >
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-coffee-300 hover:bg-coffee-100 bg-transparent"
              >
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-coffee-300 hover:bg-coffee-100 bg-transparent"
              >
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-coffee-300 hover:bg-coffee-100 bg-transparent"
              >
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-coffee-800">
              {language === "uk" ? "Швидкі посилання" : "Quick Links"}
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Головна" : "Home"}
              </Link>
              <Link href="/catalog" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Каталог" : "Catalog"}
              </Link>
              <Link href="/about" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Про нас" : "About"}
              </Link>
              <Link href="/news" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Новини" : "News"}
              </Link>
              <Link href="/contacts" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Контакти" : "Contacts"}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-coffee-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {language === "uk" ? "Оплата" : "Payment"}
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/payment" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Способи оплати" : "Payment Methods"}
              </Link>
              <Link href="/payment#cards" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Банківські карти" : "Bank Cards"}
              </Link>
              <Link href="/payment#online" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Онлайн платежі" : "Online Payments"}
              </Link>
              <Link href="/payment#cash" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Готівка при отриманні" : "Cash on Delivery"}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-coffee-800 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {language === "uk" ? "Доставка" : "Delivery"}
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/delivery" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Умови доставки" : "Delivery Terms"}
              </Link>
              <Link
                href="/delivery#ukraine"
                className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors"
              >
                {language === "uk" ? "По Україні" : "Ukraine Wide"}
              </Link>
              <Link href="/delivery#kyiv" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "По Києву" : "Kyiv Delivery"}
              </Link>
              <Link href="/delivery#pickup" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
                {language === "uk" ? "Самовивіз" : "Pickup"}
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-coffee-800">
              {language === "uk" ? "Підписка на новини" : "Newsletter"}
            </h4>
            <p className="text-sm text-coffee-600">
              {language === "uk"
                ? "Отримуйте останні новини про нові сорти кави та спеціальні пропозиції"
                : "Get the latest news about new coffee varieties and special offers"}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder={language === "uk" ? "Ваш email" : "Your email"}
                required
                className="text-sm border-coffee-300 focus:border-coffee-500"
              />
              <Button type="submit" className="w-full bg-coffee-600 hover:bg-coffee-700" size="sm">
                <Send className="h-4 w-4 mr-2" />
                {language === "uk" ? "Підписатися" : "Subscribe"}
              </Button>
            </form>

              <p className="text-xs text-coffee-500">
                {currentLanguage === "uk" ? "Підписуючись, ви погоджуєтеся з нашою" : "By subscribing, you agree to our"}{" "}
                <Link href="/privacy" className="underline hover:no-underline">
                  {currentLanguage === "uk" ? "політикою конфіденційності" : "privacy policy"}
                </Link>
              </p>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-coffee-200 mt-8 pt-6">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Phone className="h-4 w-4 text-coffee-600" />
              <span className="text-sm text-coffee-700">+38 (044) 123-45-67</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Mail className="h-4 w-4 text-coffee-600" />
              <span className="text-sm text-coffee-700">info@blackcoffee.ua</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <MapPin className="h-4 w-4 text-coffee-600" />
            <span className="text-sm text-coffee-700">
                {currentLanguage === "uk" ? "Київ, вул. Хрещатик, 22" : "Kyiv, Khreshchatyk St, 22"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-coffee-200 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-coffee-600">
            © 2024 BlackCoffee. {currentLanguage === "uk" ? "Всі права захищені" : "All rights reserved"}.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/terms" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
              {currentLanguage === "uk" ? "Умови використання" : "Terms of Use"}
            </Link>
            <Link href="/privacy" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
              {currentLanguage === "uk" ? "Конфіденційність" : "Privacy"}
            </Link>
            <Link href="/cookies" className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
