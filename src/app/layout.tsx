import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Providers } from "./providers"
import { AuthProvider } from "./auth-provider"
import { Toaster } from "sonner"
import CookieConsent from "@/components/CookieConsent"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Reclama Cidade",
  description: "Aplicativo para reportar problemas urbanos na sua cidade",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Adicionar os estilos do Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-primary`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Providers>
            {children}
            <CookieConsent />
            <Toaster richColors position="top-right" theme="dark" />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

