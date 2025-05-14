"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserData } from "@/components/user/types/user"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handleLogin: () => Promise<void>
  user: UserData | null
}

export function LoginModal({ 
  open, 
  onOpenChange, 
  handleLogin,
  user 
}: LoginModalProps) {
  // Se o usuário estiver logado, não mostramos o modal
  if (user) return null

  // Intercepta a tentativa de fechar o modal para mantê-lo aberto
  const handleOpenChange = (newOpen: boolean) => {
    // Se o usuário tentar fechar, mantemos aberto
    if (!newOpen) return
    // Caso contrário, passamos o valor para o callback
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Autenticação Necessária</DialogTitle>
          <DialogDescription>
            Para utilizar o mapa e reportar problemas na cidade, é necessário fazer login.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="max-w-xs">
            <div className="mx-auto h-[150px] w-[150px] flex items-center justify-center bg-muted rounded-md">
              <span className="text-xl font-bold">Me Arrume</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Ao fazer login, você poderá reportar problemas na cidade, 
            acompanhar o status dos problemas reportados e contribuir 
            para a melhoria da sua comunidade.
          </p>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center">
          <Button 
            variant="default" 
            onClick={handleLogin}
            className="w-full sm:w-auto"
          >
            Entrar com Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 