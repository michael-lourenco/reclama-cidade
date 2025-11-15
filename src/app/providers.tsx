
"use client"

import { AppSidebar } from "@/components/common/app-sidebar"
import CookieConsent from "@/components/common/cookie-consent"
import { ThemeProvider } from "@/components/common/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: "max-w-md",
            }}
          />
          <CookieConsent />
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
  )
}
