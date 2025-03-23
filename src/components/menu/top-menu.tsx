"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface TopMenuProps {
    menuOpen: boolean
    toggleMenu: () => void
}

const TopMenu = ({ menuOpen, toggleMenu }: TopMenuProps) => {
    return (
        <>
            {/* Toggle Menu Button */}
            <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
                <Button
                    variant="default"
                    size="icon"
                    className="bg-white text-black hover:bg-gray-100 shadow-md"
                    onClick={toggleMenu}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Side Menu */}
            {menuOpen && (
                <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transition-all">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-bold text-lg">Mapa de Problemas</h2>
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <ul className="space-y-2">
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Meus Reportes</li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Configurações</li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Ajuda</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export { TopMenu }