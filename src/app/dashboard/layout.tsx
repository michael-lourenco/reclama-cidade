import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Home, Settings, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | Urban Problems",
  description: "Dashboard para análise de problemas urbanos reportados",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-100 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Urban Problems</h2>
          <p className="text-sm text-muted-foreground">Painel de Controle</p>
        </div>

        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Página Inicial
              </Button>
            </Link>

            <Link href="/dashboard" passHref>
              <Button variant="secondary" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/users" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </Button>
            </Link>

            <Link href="/settings" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold md:hidden">Urban Problems</h1>

          <div className="flex items-center space-x-2">
            {/* Mobile menu button would go here */}
            <div className="md:hidden">{/* Mobile menu button */}</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
