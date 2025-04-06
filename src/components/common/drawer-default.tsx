"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { X } from "lucide-react"
import Image from "next/image"
import { PROBLEM_CATEGORIES } from "@/config/problem-categories"
import type { ProblemCategory } from "@/components/map/types/map"

interface DialogProblemsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  selectedProblemType: string | null
  handleProblemSelect: (problemType: string) => void
  handleConfirmProblem: () => void
}

export function DialogProblems({
  open,
  onOpenChange,
  title = "Reportar Problema",
  description = "Selecione o tipo de problema que deseja reportar",
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
}: DialogProblemsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [currentView, setCurrentView] = useState<"categories" | "subcategories">("categories")
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory | null>(null)

  const handleConfirmAndClose = () => {
    handleConfirmProblem()
    onOpenChange(false)
  }

  const renderCategories = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {PROBLEM_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
            selectedProblemType === category.type ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            if (category.subcategories && category.subcategories.length > 0) {
              setCurrentView("subcategories")
              setSelectedCategory(category)
            } else {
              handleProblemSelect(category.type)
            }
          }}
        >
          <div className={`${category.bgColor} p-2 rounded-full mb-2`}>
            <Image
              src={category.icon || "/placeholder.svg"}
              alt={`Ícone de ${category.label}`}
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </div>
          <span className="text-xs">{category.label}</span>
        </div>
      ))}
    </div>
  )

  const renderSubcategories = () => {
    if (!selectedCategory || !selectedCategory.subcategories) return null

    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        {selectedCategory.subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
              selectedProblemType === subcategory.type ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              handleProblemSelect(subcategory.type)
            }}
          >
            <div className="bg-gray-100 p-2 rounded-full mb-2">
              <Image
                src={subcategory.icon || "/placeholder.svg"}
                alt={`Ícone de ${subcategory.label}`}
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <span className="text-xs">{subcategory.label}</span>
          </div>
        ))}
        <div
          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => {
            setCurrentView("categories")
            setSelectedCategory(null)
          }}
        >
          <div className="bg-gray-100 p-2 rounded-full mb-2">
            <X className="h-5 w-5" />
          </div>
          <span className="text-xs">Voltar</span>
        </div>
      </div>
    )
  }

  const dialogContent = (
    <>
      <div className="mb-4">{currentView === "categories" ? renderCategories() : renderSubcategories()}</div>
      <Button
        className="w-full"
        disabled={!selectedProblemType}
        onClick={handleConfirmAndClose}
      >
        Confirmar Problema
      </Button>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentView === "categories" ? title : "Selecione a Subcategoria"}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid items-start gap-4">{dialogContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{currentView === "categories" ? title : "Selecione a Subcategoria"}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{dialogContent}</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  )
}

