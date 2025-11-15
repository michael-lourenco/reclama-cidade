"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { handleLogin, user } = useAuth()
  const router = useRouter()

  if (user) {
    router.push("/user")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs space-y-4">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <p className="text-center text-gray-500">Faça login para continuar</p>
        <Button
          onClick={() => handleLogin("google")}
          className="w-full"
        >
          Login com Google
        </Button>
      </div>
    </div>
  )
}
