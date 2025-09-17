"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "uk" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uk: {
    // Header
    "nav.home": "Головна",
    "nav.catalog": "Каталог",
    "nav.about": "Про нас",
    "nav.news": "Новини",
    "nav.contact": "Контакти",
    "auth.login": "Увійти",
    "auth.register": "Реєстрація",
    "auth.profile": "Профіль",
    "auth.logout": "Вийти",
    "cart.title": "Кошик",
    "cart.empty": "Кошик порожній",
    "cart.total": "Загалом",
    "cart.checkout": "Оформити замовлення",

    // Hero section
    "hero.title": "Найкраща кава для справжніх поціновувачів",
    "hero.subtitle": "Відкрийте для себе світ ароматної зернової та меленої кави від BlackCoffee",
    "hero.cta": "Переглянути каталог",

    // Products
    "products.new": "Новинки",
    "products.sale": "Акційні товари",
    "products.viewAll": "Переглянути всі",
    "products.addToCart": "Додати в кошик",
    "products.addToFavorites": "Додати в обране",
    "products.inStock": "В наявності",
    "products.outOfStock": "Немає в наявності",
    "products.price": "Ціна",
    "products.oldPrice": "Стара ціна",

    // News
    "news.latest": "Останні новини",
    "news.readMore": "Читати далі",
    "news.publishedOn": "Опубліковано",

    // Footer
    "footer.about": "Про BlackCoffee",
    "footer.aboutText":
      "Ми - команда справжніх поціновувачів кави, які прагнуть поділитися найкращими сортами з усього світу.",
    "footer.quickLinks": "Швидкі посилання",
    "footer.contact": "Контактна інформація",
    "footer.phone": "Телефон",
    "footer.email": "Email",
    "footer.address": "Адреса",
    "footer.followUs": "Слідкуйте за нами",
    "footer.rights": "Всі права захищені",

    // Common
    "common.search": "Пошук",
    "common.filter": "Фільтр",
    "common.sort": "Сортування",
    "common.loading": "Завантаження...",
    "common.error": "Помилка",
    "common.success": "Успішно",
    "common.cancel": "Скасувати",
    "common.save": "Зберегти",
    "common.delete": "Видалити",
    "common.edit": "Редагувати",
    "common.close": "Закрити",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.about": "About Us",
    "nav.news": "News",
    "nav.contact": "Contact",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.profile": "Profile",
    "auth.logout": "Logout",
    "cart.title": "Cart",
    "cart.empty": "Cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",

    // Hero section
    "hero.title": "The Best Coffee for True Connoisseurs",
    "hero.subtitle": "Discover the world of aromatic whole bean and ground coffee from BlackCoffee",
    "hero.cta": "View Catalog",

    // Products
    "products.new": "New Products",
    "products.sale": "Sale Items",
    "products.viewAll": "View All",
    "products.addToCart": "Add to Cart",
    "products.addToFavorites": "Add to Favorites",
    "products.inStock": "In Stock",
    "products.outOfStock": "Out of Stock",
    "products.price": "Price",
    "products.oldPrice": "Old Price",

    // News
    "news.latest": "Latest News",
    "news.readMore": "Read More",
    "news.publishedOn": "Published on",

    // Footer
    "footer.about": "About BlackCoffee",
    "footer.aboutText":
      "We are a team of true coffee enthusiasts who strive to share the best varieties from around the world.",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact Information",
    "footer.phone": "Phone",
    "footer.email": "Email",
    "footer.address": "Address",
    "footer.followUs": "Follow Us",
    "footer.rights": "All rights reserved",

    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("uk")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "uk" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
