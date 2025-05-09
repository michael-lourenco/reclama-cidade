"use client"

import { Button } from "@/components/ui/button"
import {
    Bell,
    ChevronRight,
    Download,
    MapPin,
    Menu,
    Navigation,
    Users,
    X,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FiLogIn } from "react-icons/fi"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full flex-col items-center border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">CityFix</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Funcionalidades
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Benefícios
            </Link>
            <Link
              href="#showcase"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Demonstração
            </Link>
            <Link
              href="#download"
              className="text-sm font-medium transition-colors hover:text-emerald-500"
            >
              Download
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="hidden bg-emerald-500 hover:bg-emerald-600 md:flex"
              >
                Entrar agora
              </Button>
            </Link>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative z-50"
                aria-label="Abrir menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Abrir menu</span>
              </Button>
              {mobileMenuOpen && (
                <div
                  className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div
                    className="fixed inset-y-0 right-0 z-40 w-3/4 overflow-y-auto bg-white p-6 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mt-6 flex flex-col space-y-6">
                      <Link
                        href="#features"
                        className="text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Funcionalidades
                      </Link>
                      <Link
                        href="#benefits"
                        className="text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Benefícios
                      </Link>
                      <Link
                        href="#showcase"
                        className="text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Demonstração
                      </Link>
                      <Link
                        href="#download"
                        className="text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Faça a diferença
                      </Link>
                      <div className="flex flex-col gap-4 pt-6">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Entrar
                        </Button>
                        <Button
                          className="w-full bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Baixar App
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex w-full flex-col items-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Reporte Problemas Urbanos. Faça a Diferença.
                  </h1>
                  <p className="text-muted-foreground max-w-[600px] text-lg md:text-xl">
                    O CityFix capacita cidadãos a reportar problemas de
                    infraestrutura e acompanhar sua resolução em tempo real.
                    Juntos, construímos comunidades melhores.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/map">
                    <Button
                      size="lg"
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Entrar agora
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                    >
                      Saiba Mais
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/reporta-cidade.svg?height=684&width=334"
                  width={500}
                  height={1042}
                  alt="CityFix mobile app showing a map with infrastructure issue markers"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="flex w-full flex-col items-center py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Funcionalidades Poderosas
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  O CityFix torna o reporte e acompanhamento de problemas de
                  infraestrutura simples e eficaz.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <MapPin className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Reporte Fácil de Problemas
                  </h3>
                  <p className="text-muted-foreground">
                    Selecione um tipo de problema, adicione uma foto e marque a
                    localização no mapa com apenas alguns toques.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Navigation className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Mapa Interativo</h3>
                  <p className="text-muted-foreground">
                    Visualize todos os problemas reportados em um mapa
                    interativo com ícones personalizados para diferentes tipos
                    de problemas.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Engajamento Comunitário</h3>
                  <p className="text-muted-foreground">
                    Vote nos problemas, adicione comentários e colabore com
                    vizinhos para melhorar sua comunidade.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Bell className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Atualizações em Tempo Real
                  </h3>
                  <p className="text-muted-foreground">
                    Receba notificações quando seus problemas reportados forem
                    reconhecidos, estiverem em andamento ou forem resolvidos.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    className="h-8 w-8 text-emerald-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Priorização de Problemas
                  </h3>
                  <p className="text-muted-foreground">
                    A votação da comunidade ajuda os funcionários da cidade a
                    identificar e priorizar os problemas mais urgentes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    className="h-8 w-8 text-emerald-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Acompanhamento de Progresso
                  </h3>
                  <p className="text-muted-foreground">
                    Monitore o status de todos os problemas reportados e veja
                    como sua cidade está melhorando ao longo do tempo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="flex w-full flex-col items-center bg-slate-50 py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Por Que Usar o CityFix?
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Benefícios tanto para cidadãos quanto para funcionários
                  públicos.
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-10 md:gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <h3 className="text-center text-2xl font-bold">
                  Para Cidadãos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Reporte Fácil de Problemas
                      </h4>
                      <p className="text-muted-foreground">
                        Reporte problemas em segundos sem navegar por sites
                        governamentais complexos ou fazer ligações telefônicas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Transparência</h4>
                      <p className="text-muted-foreground">
                        Veja todos os problemas reportados e acompanhe seu
                        progresso desde o envio até a resolução.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Construção de Comunidade
                      </h4>
                      <p className="text-muted-foreground">
                        Conecte-se com vizinhos que se preocupam em melhorar sua
                        comunidade.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Bairros Mais Seguros
                      </h4>
                      <p className="text-muted-foreground">
                        Contribua para criar espaços públicos mais seguros e
                        funcionais para todos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-center text-2xl font-bold">
                  Para Funcionários Públicos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Gestão Eficiente de Problemas
                      </h4>
                      <p className="text-muted-foreground">
                        Sistema centralizado para acompanhar e gerenciar
                        problemas de infraestrutura.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Decisões Baseadas em Dados
                      </h4>
                      <p className="text-muted-foreground">
                        Acesso a dados e análises em tempo real para orientar a
                        alocação de recursos e planejamento.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Comunicação Aprimorada
                      </h4>
                      <p className="text-muted-foreground">
                        Canal direto para se comunicar com os cidadãos sobre
                        problemas de infraestrutura.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-5 w-5 text-emerald-500"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Redução de Custos
                      </h4>
                      <p className="text-muted-foreground">
                        A detecção precoce de problemas evita reparos mais caros
                        no futuro.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Section */}
        <section
          id="showcase"
          className="flex w-full flex-col items-center py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Veja o CityFix em Ação
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore como nosso aplicativo funciona para melhorar a
                  infraestrutura da sua cidade.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="CityFix app showing the issue reporting screen"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Reporte Problemas em Segundos
                </h3>
                <p className="text-muted-foreground">
                  Selecione um tipo de problema, tire uma foto e marque a
                  localização no mapa. É simples assim.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="CityFix app showing the map view with issue markers"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Mapa Interativo de Problemas
                </h3>
                <p className="text-muted-foreground">
                  Visualize todos os problemas reportados em um mapa interativo
                  com ícones personalizados para diferentes tipos de problemas.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="CityFix app showing the issue details and status updates"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  Acompanhe o Progresso dos Problemas
                </h3>
                <p className="text-muted-foreground">
                  Acompanhe o status dos problemas reportados desde o envio até
                  a resolução com atualizações em tempo real.
                </p>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-background overflow-hidden rounded-lg border shadow">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="CityFix app showing the community engagement features"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Engajamento Comunitário</h3>
                <p className="text-muted-foreground">
                  Vote nos problemas, adicione comentários e colabore com
                  vizinhos para melhorar sua comunidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="download"
          className="flex w-full flex-col items-center bg-emerald-500 py-12 text-white md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para Fazer a Diferença?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Baixe o CityFix hoje e comece a reportar problemas de
                  infraestrutura na sua comunidade.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                <Link
                  href="/login"
                  className="focus-visible:ring-ring inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-emerald-500 shadow transition-colors hover:bg-gray-100 focus-visible:ring-1 focus-visible:outline-none"
                >
                  <FiLogIn className="mr-2 h-5 w-5" />
                  Entrar agora
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full flex-col items-center border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-500" />
            <p className="text-muted-foreground text-sm">
              © 2023 CityFix. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
            >
              Termos de Serviço
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm hover:text-emerald-500"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
