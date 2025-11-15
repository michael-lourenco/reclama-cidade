
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function EditProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(user?.user_metadata.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isUpdating, setIsUpdating] = useState(false)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    router.push("/login") // Redirect to login if not authenticated
    return null
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: {
          name: name,
        },
      })

      if (error) {
        throw error
      }

      toast.success("Perfil atualizado com sucesso!")
      router.push("/user") // Redirect back to user profile page
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Editar Perfil</h1>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isUpdating}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={true} // Email usually cannot be changed directly via user_metadata
            />
          </div>
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Atualizando..." : "Salvar Alterações"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/user")}>
            Cancelar
          </Button>
        </form>
      </div>
    </div>
  )
}
