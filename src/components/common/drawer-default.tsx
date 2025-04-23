"use client"

import Image from "next/image"
import { useState } from "react"

import type { ProblemCategory } from "@/components/map/types/map"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

import {
  PROBLEM_CATEGORIES,
  TProblemSubcategory,
  TProblemType,
} from "@/constants/map-constants"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { CircleCheck, X } from "lucide-react"
import { Label } from "../ui/label"

interface DialogProblemsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  selectedProblemType: TProblemType | undefined
  handleProblemSelect: (ProblemType: TProblemType) => void
  handleConfirmProblem: () => void
}

// Componente utilitário para exibir ícones
const CategoryIcon = ({
  src,
  alt,
  size = 70,
  selected = false,
}: {
  src?: string
  alt: string
  size?: number
  selected?: boolean
}) => (
  <div
    className={cn(
      "relative mb-2 flex h-20 w-20 items-center justify-center rounded-full outline-offset-2",
      "bg-gray-700 dark:bg-gray-600",
      "group-hover:outline-4 group-active:outline-sky-500",
      { "outline-4 outline-sky-500 dark:outline-sky-500": selected },
    )}
  >
    {selected && (
      <CircleCheck
        className="stroke-background absolute -top-2 -right-3 fill-sky-500"
        size={32}
      />
    )}
    <Image
      src={src || "/placeholder.png"}
      alt={alt}
      width={size}
      height={size}
      className="h-14 w-14 object-contain"
    />
  </div>
)

export function DialogProblems({
  open,
  onOpenChange,
  title = "Reportar Problema",
  description = "Selecione o tipo de problema que deseja marcar no mapa.",
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
}: DialogProblemsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [currentView, setCurrentView] = useState<
    "categories" | "subcategories"
  >("categories")
  const [selectedCategory, setSelectedCategory] =
    useState<ProblemCategory | null>(null)

  const confirmAndClose = () => {
    handleConfirmProblem()
    onOpenChange(false)
  }

  const itemClasses =
    "flex flex-col items-center p-2 rounded cursor-pointer group"

  const renderCategories = () => (
    <div className="grid grid-cols-3 gap-4">
      {PROBLEM_CATEGORIES.map(({ id, type, label, icon, subcategories }) => {
        const isSelected = selectedProblemType === type

        const handleClick = () => {
          if (subcategories?.length) {
            setSelectedCategory({
              id,
              type,
              label,
              icon,
              subcategories,
              bgColor: "defaultColor",
            })
            setCurrentView("subcategories")
          } else {
            handleProblemSelect(type as TProblemSubcategory)
          }
        }

        return (
          <div
            key={id}
            className={itemClasses}
            onClick={handleClick}
          >
            <CategoryIcon
              src={icon}
              alt={`Ícone de ${label}`}
              selected={isSelected}
            />
            <Label className="text-center text-xs">{label}</Label>
          </div>
        )
      })}
    </div>
  )

  const renderSubcategories = () => {
    if (!selectedCategory?.subcategories) return null

    return (
      <div className="mb-4 grid grid-cols-3 gap-4">
        {selectedCategory.subcategories.map(({ id, type, label, icon }) => {
          const isSelected = selectedProblemType === type

          return (
            <div
              key={id}
              className={itemClasses}
              onClick={() => handleProblemSelect(type as TProblemSubcategory)}
            >
              <CategoryIcon
                src={icon}
                alt={`Ícone de ${label}`}
                selected={isSelected}
              />
              <Label className="text-center text-xs">{label}</Label>
            </div>
          )
        })}
      </div>
    )
  }

  const renderSelectedIcon = () => {
    const selected = PROBLEM_CATEGORIES.find(
      (c) => c.type === selectedProblemType,
    )
    if (!selected) return null

    return (
      <div className="mb-4 flex items-center justify-center">
        <CategoryIcon
          src={selected.icon}
          alt={`Ícone de ${selected.label}`}
        />
      </div>
    )
  }

  const content = (
    <>
      {renderSelectedIcon()}
      <div>
        {currentView === "categories"
          ? renderCategories()
          : renderSubcategories()}
      </div>

      <div className="flex gap-2">
        {currentView === "subcategories" && (
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => {
              setCurrentView("categories")
              setSelectedCategory(null)
              handleProblemSelect()
            }}
          >
            Voltar
          </Button>
        )}
        {selectedProblemType && currentView === "subcategories" && (
          <>
            <Button
              className="flex-1"
              onClick={confirmAndClose}
            >
              Relatar Problema
            </Button>
          </>
        )}
      </div>
    </>
  )

  return isDesktop ? (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentView === "categories" ? title : "Qual o problema?"}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid items-start gap-4">{content}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerPortal>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {currentView === "categories"
                ? title
                : "Selecione a Subcategoria"}
            </DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  )
}
