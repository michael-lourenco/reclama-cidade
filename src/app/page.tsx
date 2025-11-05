"use client"

import ThemeToggle from "@/components/toggle-mode"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  ChevronRight,
  MapPin,
  Menu,
  Quote, // Import Quote icon
  Users,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"

const featuresSection = [
  {
    title: "Reporte Inteligente",
    description:
      "Obtenha relatórios detalhados sobre a sua cidade com apenas alguns cliques.",
    icon: <Bell className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Mapa Interativo",
    description:
      "Visualize todos os problemas reportados em um mapa dinâmico e filtrado.",
    icon: <MapPin className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Engajamento Comunitário",
    description:
      "Participe ativamente, vote nos problemas mais urgentes e colabore.",
    icon: <Users className="h-8 w-8 text-blue-500" />,
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white dark:bg-gray-950">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b shadow-sm backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            href="#"
            className="flex items-center gap-2"
          >
            <MapPin className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Reclama Cidade
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-blue-500"
            >
              Funcionalidades
            </Link>
            <Link
              href="#testimonials"
              className="transition-colors hover:text-blue-500"
            >
              Depoimentos
            </Link>
            <Link
              href="#cta"
              className="transition-colors hover:text-blue-500"
            >
              Participe
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/map">
              <Button className="hidden bg-blue-600 hover:bg-blue-700 sm:flex">
                Acessar o Mapa
              </Button>
            </Link>
            <ThemeToggle />
            <div className="flex items-center md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                >
                  <DropdownMenuItem asChild>
                    <Link href="#features">Funcionalidades</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#testimonials">Depoimentos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#cta">Participe</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/map">Acessar o Mapa</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-white pt-24 md:pt-32 lg:pt-40 dark:bg-gray-950">
          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <div className="grid min-h-[60vh] items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col items-center justify-center space-y-6 text-center lg:items-start lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-blue-600 sm:text-5xl md:text-6xl lg:text-7xl dark:text-blue-400">
                    Transforme Sua Cidade, Um Reporte de Cada Vez
                  </h1>
                  <p className="max-w-xl text-lg text-gray-700 md:text-xl dark:text-gray-300">
                    O{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Reclama Cidade
                    </span>{" "}
                    é a plataforma que conecta você à sua prefeitura para
                    resolver problemas urbanos de forma rápida e transparente.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/map">
                    <Button
                      size="lg"
                      className="bg-blue-600 px-8 py-6 text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
                    >
                      Reportar um Problema
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 px-8 py-6 text-lg text-gray-700 shadow-sm transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Ver Funcionalidades
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/reporta-cidade.svg"
                  width={550}
                  height={550}
                  alt="App Reclama Cidade em uso"
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full bg-gray-50 py-20 md:py-28 lg:py-32 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                Funcionalidades Principais
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tudo que Você Precisa para Fazer a Diferença
              </h2>
              <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                Nossa plataforma foi desenhada para ser intuitiva, poderosa e
                acessível a todos os cidadãos.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featuresSection.map((feature, index) => (
                <div
                  key={index}
                  className="flex transform flex-col items-center gap-4 rounded-xl border border-transparent bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800 dark:hover:border-blue-500"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-md text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full bg-white py-20 md:py-28 lg:py-32 dark:bg-gray-950"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                O Que Nossos Usuários Dizem
              </h2>
              <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                O impacto do Reclama Cidade, contado por quem vive a
                transformação.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <TestimonialCard
                name="Carlos Ferreira"
                role="Morador de São Paulo"
                avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
                quote="Nunca foi tão fácil ser ouvido! Reportei um buraco na minha rua e em poucos dias a equipe da prefeitura já estava trabalhando no local."
              />
              <TestimonialCard
                name="Juliana Alves"
                role="Líder Comunitária"
                avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                quote="Acompanhar o status dos problemas e votar nas prioridades do bairro me faz sentir parte da solução. É uma ferramenta de cidadania incrível."
              />
              <TestimonialCard
                name="Roberto Martins"
                role="Gestor Público"
                avatarUrl="https://randomuser.me/api/portraits/men/65.jpg"
                quote="O Reclama Cidade otimizou nossa gestão de demandas. Conseguimos priorizar com base em dados e nos comunicar de forma eficiente com a população."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          className="w-full bg-gray-50 py-20 md:py-28 lg:py-32 dark:bg-gray-900"
        >
          <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center md:px-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-blue-600 sm:text-4xl md:text-5xl dark:text-blue-400">
                Faça Parte da Mudança Agora Mesmo
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Junte-se a milhares de cidadãos que estão melhorando suas
                cidades. Crie seu primeiro reporte e veja o poder da ação
                coletiva.
              </p>
            </div>
            <Link href="/map">
              <Button
                size="lg"
                className="bg-blue-600 px-10 py-7 text-xl shadow-lg hover:bg-blue-700"
              >
                Começar a Usar
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Reclama Cidade. Todos os direitos reservados.
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-400"
            >
              Termos de Serviço
            </Link>
            <Link
              href="#"
              className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-400"
            >
              Privacidade
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function TestimonialCard({
  name,
  role,
  avatarUrl,
  quote,
}: {
  name: string
  role: string
  avatarUrl: string
  quote: string
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-md dark:bg-gray-800">
      <Quote className="h-10 w-10 text-blue-200 dark:text-blue-800" />
      <p className="mt-4 flex-1 text-lg text-gray-700 italic dark:text-gray-300">
        “{quote}”
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Image
          src={avatarUrl}
          width={56}
          height={56}
          alt={`Avatar de ${name}`}
          className="rounded-full"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}

// NOTE: The ReclamaCidadeStats component was removed for simplification
// as it contained logic (setInterval) not ideal for a static landing page component.
// It can be re-added in a more appropriate context if needed.
