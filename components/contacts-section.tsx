"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactsSection() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Симуляція відправки форми
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(
      language === "uk"
        ? "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом."
        : "Thank you for your message! We will contact you soon.",
    )

    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: { uk: "Адреса", en: "Address" },
      content: {
        uk: "вул. Хрещатик, 22\nКиїв, 01001\nУкраїна",
        en: "Khreshchatyk St, 22\nKyiv, 01001\nUkraine",
      },
    },
    {
      icon: Phone,
      title: { uk: "Телефон", en: "Phone" },
      content: { uk: "+38 (044) 123-45-67", en: "+38 (044) 123-45-67" },
    },
    {
      icon: Mail,
      title: { uk: "Email", en: "Email" },
      content: { uk: "info@blackcoffee.ua", en: "info@blackcoffee.ua" },
    },
    {
      icon: Clock,
      title: { uk: "Години роботи", en: "Working Hours" },
      content: {
        uk: "Пн-Пт: 8:00 - 20:00\nСб-Нд: 9:00 - 18:00",
        en: "Mon-Fri: 8:00 - 20:00\nSat-Sun: 9:00 - 18:00",
      },
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Контакти" : "Contacts"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Зв'яжіться з нами будь-яким зручним способом. Ми завжди раді допомогти!"
              : "Contact us in any convenient way. We are always happy to help!"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-coffee-800 mb-6 font-serif">
              {language === "uk" ? "Контактна інформація" : "Contact Information"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-coffee-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-coffee-800 mb-2">{info.title[language]}</h3>
                        <p className="text-coffee-600 whitespace-pre-line">{info.content[language]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="h-64 bg-coffee-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-coffee-600">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>{language === "uk" ? "Карта розташування" : "Location Map"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-coffee-800 font-serif">
                  {language === "uk" ? "Напишіть нам" : "Write to Us"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-2">
                        {language === "uk" ? "Ім'я" : "Name"}
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={language === "uk" ? "Ваше ім'я" : "Your name"}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-2">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={language === "uk" ? "Ваш email" : "Your email"}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-coffee-700 mb-2">
                      {language === "uk" ? "Тема" : "Subject"}
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={language === "uk" ? "Тема повідомлення" : "Message subject"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-coffee-700 mb-2">
                      {language === "uk" ? "Повідомлення" : "Message"}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={language === "uk" ? "Ваше повідомлення..." : "Your message..."}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-coffee-600 hover:bg-coffee-700">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {language === "uk" ? "Відправляємо..." : "Sending..."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {language === "uk" ? "Відправити повідомлення" : "Send Message"}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ContactsSection }
