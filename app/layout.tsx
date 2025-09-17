import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "BlackCoffee - Інтернет-магазин зернової та меленої кави",
  description: "Найкраща зернова та мелена кава від BlackCoffee. Широкий асортимент, швидка доставка, найкращі ціни.",
  keywords: "кава, зернова кава, мелена кава, BlackCoffee, інтернет-м��газин кави, купити каву",
  authors: [{ name: "BlackCoffee Team" }],
  creator: "BlackCoffee",
  publisher: "BlackCoffee",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "http://localhost:3000",
    siteName: "BlackCoffee",
    title: "BlackCoffee - Інтернет-магазин зернової та меленої кави",
    description: "Найкраща зернова та мелена кава від BlackCoffee. Широкий асортимент, швидка доставка, найкращі ціни.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BlackCoffee - Інтернет-магазин кави",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackCoffee - Інтернет-магазин зернової та меленої кави",
    description: "Найкраща зернова та мелена кава від BlackCoffee. Широкий асортимент, швидка доставка, найкращі ціни.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D8CFC4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}