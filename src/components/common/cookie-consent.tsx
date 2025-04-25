"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent")
    if (storedConsent !== null) {
      setConsent(storedConsent === "true")
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true")
    setConsent(true)
  }

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "false")
    setConsent(false)
  }

  if (consent !== null) return null

  return (
    <div className="bg-background text-foreground fixed bottom-0 left-0 z-10 flex w-full flex-col items-center justify-between p-4 shadow-md md:flex-row">
      <p className="text-sm">
        Usamos cookies para melhorar sua experiência. Ao continuar, você
        concorda com nossa{" "}
        <a
          href="/politica-de-cookies"
          className="text-blue-400 underline"
        >
          Política de Cookies
        </a>
        .
      </p>
      <div className="mt-2 flex space-x-2 md:mt-0">
        <Button
          onClick={handleAccept}
          variant="default"
        >
          Aceitar
        </Button>
        <Button
          onClick={handleReject}
          variant="outline"
        >
          Recusar
        </Button>
      </div>
    </div>
  )
}
