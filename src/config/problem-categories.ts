// src/config/problem-categories.ts
import { PROBLEM_TYPES } from "@/constants/map-constants";
import type { ProblemCategory } from "@/types/map";

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: "BURACO",
    type: PROBLEM_TYPES.BURACO,
    label: "Buraco",
    icon: "/map-icons/buraco.svg",
    bgColor: "bg-red-100",
    subcategories: [
      {
        id: "BUEIRO_ABERTO",
        type: PROBLEM_TYPES.BUEIRO_ABERTO,
        label: "Bueiro Aberto",
        icon: "/map-icons/bueiro-aberto.svg",
      },
      {
        id: "BUEIRO_VAZAMENTO",
        type: PROBLEM_TYPES.BUEIRO_VAZAMENTO,
        label: "Bueiro Vazamento",
        icon: "/map-icons/bueiro-vazamento.svg",
      },
    ],
  },
  {
    id: "ALERTA",
    type: PROBLEM_TYPES.ALERTA,
    label: "Alerta",
    icon: "/map-icons/alerta.svg",
    bgColor: "bg-yellow-100",
    subcategories: [
      {
        id: "BLITZ",
        type: PROBLEM_TYPES.BLITZ,
        label: "Blitz",
        icon: "/map-icons/blitz.svg",
      },
      {
        id: "PISTA",
        type: PROBLEM_TYPES.PISTA,
        label: "Pista",
        icon: "/map-icons/pista.svg",
      },
    ],
  },
  {
    id: "ILUMINACAO",
    type: PROBLEM_TYPES.ILUMINACAO,
    label: "Iluminação",
    icon: "/map-icons/iluminacao-publica.svg",
    bgColor: "bg-blue-100",
    subcategories: [
      {
        id: "SEMAFARO",
        type: PROBLEM_TYPES.SEMAFARO,
        label: "Semáfaro",
        icon: "/map-icons/semafaro.svg",
      },
    ],
  },
];
