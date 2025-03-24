"use client";

import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";

export default function About() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
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
  );
}
