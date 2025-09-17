"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ChevronDown } from "lucide-react"

const coffeeBeansData = [
  { left: 18.35, top: 21.31, delay: 1.65, duration: 9.89 },
  { left: 31.51, top: 47.39, delay: 0.33, duration: 7.71 },
  { left: 87.83, top: 45.1, delay: 3.46, duration: 8.6 },
  { left: 1.27, top: 21.2, delay: 0.75, duration: 6.41 },
  { left: 5.83, top: 97.15, delay: 2.01, duration: 8.0 },
  { left: 40.66, top: 61.51, delay: 0.08, duration: 7.14 },
  { left: 71.25, top: 90.67, delay: 3.22, duration: 6.1 },
  { left: 96.66, top: 93.89, delay: 5.04, duration: 7.94 },
  { left: 74.5, top: 8.4, delay: 5.66, duration: 8.28 },
  { left: 91.19, top: 43.2, delay: 2.48, duration: 9.58 },
  { left: 38.73, top: 0.11, delay: 4.38, duration: 9.23 },
  { left: 89.63, top: 39.99, delay: 1.13, duration: 6.87 },
]

export function HeroSection() {
  const { t } = useLanguage()
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" suppressHydrationWarning>
      {/* Parallax Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/coffee_beans.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Coffee Beans */}
      {isMounted && (
        <div className="absolute inset-0 z-10">
          {coffeeBeansData.map((bean, i) => (
            <div
              key={i}
              className="coffee-bean floating"
              style={{
                left: `${bean.left}%`,
                top: `${bean.top}%`,
                animationDelay: `${bean.delay}s`,
                animationDuration: `${bean.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair mb-6 leading-tight">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={() => (window.location.href = "/catalog")}
            >
              {t("hero.cta")}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => (window.location.href = "/about")}
            >
              Дізнатися більше
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full hidden lg:block" />
      <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/30 rounded-full hidden lg:block" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-white/30 rounded-full hidden lg:block" />
    </section>
  )
}
