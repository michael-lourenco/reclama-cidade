"use client"

import { useNavigation } from "@/hooks/useNavigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { UserInfo } from "@/components/UserInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/icons"
import { Footer } from "@/components/Footer"

export default function About() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth()
  const navigationService = useNavigation()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <main className="flex-grow flex flex-col items-center justify-start pt-4">
        <div className="max-w-4xl mx-auto">
          <h1> Reclama Cidade </h1>
        </div>
      </main>
      <Footer />
    </div>
  )
}

