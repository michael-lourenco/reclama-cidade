import { Button } from "@/components/ui/button";
import { PROBLEM_CATEGORIES } from "@/config/problem-categories";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { ProblemCategory, ProblemSubcategory } from "@/types/map";

interface ReportMenuProps {
  reportMenuOpen: boolean;
  toggleReportMenu: () => void;
  selectedProblemType: string | null;
  handleProblemSelect: (problemType: string) => void;
  handleConfirmProblem: () => void;
}

export const ReportMenu: React.FC<ReportMenuProps> = ({
  reportMenuOpen,
  toggleReportMenu,
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
}) => {
  const [currentView, setCurrentView] = useState<"categories" | "subcategories">("categories");
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory | null>(null);

  if (!reportMenuOpen) return null;

  const renderCategories = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {PROBLEM_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
            selectedProblemType === category.type ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            queueMicrotask(() => {
              if (category.subcategories && category.subcategories.length > 0) {
                setCurrentView("subcategories");
                setSelectedCategory(category);
              } else {
                handleProblemSelect(category.type);
              }
            });
          }}
        >
          <div className={`${category.bgColor} p-2 rounded-full mb-2`}>
            <Image
              src={category.icon}
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
  );

  const renderSubcategories = () => {
    if (!selectedCategory || !selectedCategory.subcategories) return null;

    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        {selectedCategory.subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
              selectedProblemType === subcategory.type ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              queueMicrotask(() => {
                handleProblemSelect(subcategory.type);
              });
            }}
          >
            <div className="bg-gray-100 p-2 rounded-full mb-2">
              <Image
                src={subcategory.icon}
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
            queueMicrotask(() => {
              setCurrentView("categories");
              setSelectedCategory(null);
            });
          }}
        >
          <div className="bg-gray-100 p-2 rounded-full mb-2">
            <X className="h-5 w-5" />
          </div>
          <span className="text-xs">Voltar</span>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute bg-background bottom-0 left-0 right-0 rounded-t-2xl shadow-lg z-20 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">
          {currentView === "categories" ? "Reportar Problema" : "Selecione a Subcategoria"}
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {currentView === "categories" ? renderCategories() : renderSubcategories()}

      <Button
        className="w-full"
        disabled={!selectedProblemType}
        onClick={handleConfirmProblem}
      >
        Confirmar Problema
      </Button>
    </div>
  );
};