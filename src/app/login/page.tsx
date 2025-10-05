import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth/auth-options"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/user")
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <Button asChild>
        <Link href="/api/auth/signin">Entrar com Google</Link>
      </Button>
    </div>
  )
}
