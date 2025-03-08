"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (storedConsent !== null) {
      setConsent(storedConsent === "true");
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setConsent(true);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "false");
    setConsent(false);
  };

  if (consent !== null) return null; // Oculta o banner se o usuário já escolheu

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between shadow-md">
      <p className="text-sm">
        Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{" "}
        <a href="/politica-de-cookies" className="underline text-blue-400">Política de Cookies</a>.
      </p>
      <div className="flex space-x-2 mt-2 md:mt-0">
        <Button onClick={handleAccept} className="bg-green-500 hover:bg-green-600">
          Aceitar
        </Button>
        <Button onClick={handleReject} variant="outline" className="border-gray-400 text-gray-300 hover:text-white">
          Recusar
        </Button>
      </div>
    </div>
  );
}
