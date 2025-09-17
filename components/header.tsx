"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Menu, Search, ShoppingCart, User, Heart, Globe, LogOut, Settings, Package } from "lucide-react"
import { AuthModal } from "./auth-modal"
import { CartSheet } from "./cart-sheet"

export function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  useEffect(() => {
    setIsMounted(true)
    setTotalItems(getTotalItems())
  }, [getTotalItems])

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16" suppressHydrationWarning={true} />
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4" suppressHydrationWarning={true}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg font-playfair">BlackCoffee</span>
              <span className="text-xs text-muted-foreground">Premium Coffee</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.catalog")}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.news")}
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("common.search")} className="pl-8" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4" />
                  <span className="ml-1 text-xs">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("uk")}>🇺🇦 Українська</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>🇺🇸 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites">
                <Heart className="h-4 w-4" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("auth.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Історія замовлень
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                <User className="h-4 w-4 mr-1" />
                {t("auth.login")}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t("common.search")} className="pl-8" />
                  </div>

                  <nav className="flex flex-col space-y-2">
                    <Link
                      href="/"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.home")}
                    </Link>
                    <Link
                      href="/catalog"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.catalog")}
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.about")}
                    </Link>
                    <Link
                      href="/news"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.news")}
                    </Link>
                    <Link
                      href="/contact"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("nav.contact")}
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

export default Header
