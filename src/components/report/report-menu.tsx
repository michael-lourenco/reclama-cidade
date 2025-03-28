"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PROBLEM_TYPES } from "@/constants/map-constants";
import { X } from "lucide-react";
import React, { useState } from "react";

// Define a type for the subcategory
type Subcategory = {
  icon: string;
  label: string;
  type: string;
};

// Create a type that matches exactly the keys of PROBLEM_TYPES
type ProblemTypesKeys = keyof typeof PROBLEM_TYPES;

// Define a type for the subcategories object
type SubcategoriesType = {
  [K in ProblemTypesKeys]?: Subcategory[];
};

interface ReportMenuProps {
  reportMenuOpen: boolean;
  toggleReportMenu: () => void;
  selectedProblemType: string | null;
  handleProblemSelect: (problemType: string) => void;
  handleConfirmProblem: () => void;
}

const ReportMenu: React.FC<ReportMenuProps> = ({
  reportMenuOpen,
  toggleReportMenu,
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
}) => {
  const [currentView, setCurrentView] = useState<'categories' | 'subcategories'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<typeof PROBLEM_TYPES[ProblemTypesKeys] | null>(null);

  if (!reportMenuOpen) return null;

  const subcategories: SubcategoriesType = {
    ALAGAMENTO: [
      { icon: "/map-icons/blitz.svg", label: "Blitz", type: "blitz" },
      { icon: "/map-icons/pista.svg", label: "Pista", type: "pista" }
    ],
    BURACO: [
      { icon: "/map-icons/bueiro-aberto.svg", label: "Bueiro Aberto", type: "bueiro-aberto" },
      { icon: "/map-icons/bueiro-vazamento.svg", label: "Bueiro Vazamento", type: "bueiro-vazamento" }
    ],
    ILUMINACAO: [
      { icon: "/map-icons/semafaro.svg", label: "Semáfaro", type: "semafaro" }
    ]
  };

  const renderCategories = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[
        { 
          type: PROBLEM_TYPES.BURACO, 
          icon: "/map-icons/buraco.svg", 
          label: "Buraco", 
          bgColor: "bg-red-100" 
        },
        { 
          type: PROBLEM_TYPES.ALAGAMENTO, 
          icon: "/map-icons/alerta.svg", 
          label: "Alagamento", 
          bgColor: "bg-yellow-100" 
        },
        { 
          type: PROBLEM_TYPES.ILUMINACAO, 
          icon: "/map-icons/iluminacao-publica.svg", 
          label: "Iluminação", 
          bgColor: "bg-blue-100" 
        }
      ].map((category) => (
        <div
          key={category.type}
          className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
            selectedProblemType === category.type ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            queueMicrotask(() => {
              setCurrentView('subcategories');
              setSelectedCategory(category.type);
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
    const categoryKey = Object.keys(PROBLEM_TYPES).find(
      key => PROBLEM_TYPES[key as ProblemTypesKeys] === selectedCategory
    ) as ProblemTypesKeys | undefined;

    if (!categoryKey || !subcategories[categoryKey]) return null;

    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        {subcategories[categoryKey]!.map((subcategory) => (
          <div
            key={subcategory.type}
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
              setCurrentView('categories');
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
          {currentView === 'categories' ? 'Reportar Problema' : 'Selecione a Subcategoria'}
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {currentView === 'categories' ? renderCategories() : renderSubcategories()}
      
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

export { ReportMenu };