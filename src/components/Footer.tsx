"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "./icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  { icon: "LuHome", label: "Home", href: "/" },
  { icon: "LuHelpCircle", label: "Sobre", href: "/about" },
  { icon: "LuUser", label: "Perfil", href: "/user" },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <footer className="sticky bottom-0 w-full bg-background border-dashed border-t ">
        <nav className="max-w-md mx-auto px-0 py-0">
          <div className="flex justify-between items-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={isActive ? "ghost" : "secondary"}
                      className="flex-1 flex flex-col items-center justify-center h-16 space-y-1 rounded-none"
                    >
                      <Link href={item.href}>
                        {/* <Icon name={item.icon} className="h-5 w-5" /> */}
                        <span className="text-xs font-medium">{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </footer>
    </TooltipProvider>
  )
}

