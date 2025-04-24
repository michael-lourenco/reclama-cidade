// src/constants/map-constants.ts

import { ProblemCategory, ProblemType } from "@/components/map/types/map"

export type TProblemType = keyof typeof PROBLEM_TYPES
export type TProblemSubcategory =
  keyof (typeof PROBLEM_TYPES)[keyof typeof PROBLEM_TYPES]["subcategories"]

export const PROBLEM_TYPES = {
  POLICIA: {
    label: "Polícia",
    icon: "/map-icons/policia.svg",
    subcategories: {
      POLICIA: {
        label: "Polícia",
        icon: "/map-icons/policia.svg",
      },
      BAFOMETRO: {
        label: "Bafômetro",
        icon: "/map-icons/bafometro.svg",
      },
      TIROTEIO: {
        label: "Tiroteio",
        icon: "/map-icons/tiroteio.svg",
      },
      BLITZ: {
        label: "Blitz",
        icon: "/map-icons/blitz.svg",
      },
      SOM_ALTO: {
        label: "SOM ALTO",
        icon: "/map-icons/som-alto.svg",
      },
    },
  },
  INFRAESTRUTURA: {
    label: "Infraestrutura",
    icon: "/map-icons/iluminacao.svg",
    subcategories: {
      INFRAESTRUTURA: {
        label: "Infraestrutura",
        icon: "/map-icons/iluminacao.svg",
      },
      INFRAESTRUTURA_ILUMINACAO_PUBLICA: {
        label: "Iluminação Pública",
        icon: "/map-icons/iluminacao-publica.svg",
      },
      INFRAESTRUTURA_SEMAFORO: {
        label: "Semáforo",
        icon: "/map-icons/semaforo.svg",
      },
      INFRAESTRUTURA_PLACA_QUEBRADA: {
        label: "Placa Quebrada",
        icon: "/map-icons/placa-quebrada.svg",
      },
      INFRAESTRUTURA_MATO_ALTO: {
        label: "Mato Alto",
        icon: "/map-icons/mato-alto.svg",
      },
    },
  },
  PISTA: {
    label: "Pista",
    icon: "/map-icons/pista.svg",
    subcategories: {
      PISTA: {
        label: "Pista",
        icon: "/map-icons/pista.svg",
      },
      PISTA_BURACO: {
        label: "Buraco na via",
        icon: "/map-icons/pista-buraco.svg",
      },
      PISTA_OBJETO: {
        label: "Objeto na pista",
        icon: "/map-icons/pista-objeto.svg",
      },
      PISTA_OLEO: {
        label: "Óleo na pista",
        icon: "/map-icons/pista-oleo.svg",
      },
      PISTA_ARVORE: {
        label: "Árvore na pista",
        icon: "/map-icons/pista-arvore.svg",
      },
      PISTA_ALERTA: {
        label: "Alerta na pista",
        icon: "/map-icons/pista-alerta.svg",
      },
      PISTA_POSTE: {
        label: "Quebra de poste",
        icon: "/map-icons/pista-poste.svg",
      },
      PISTA_VEICULO_ABANDONADO: {
        label: "Veículo abandonado",
        icon: "/map-icons/pista-veiculo-abandonado.svg",
      },
    },
  },
  AGUA: {
    label: "Água",
    icon: "/map-icons/agua.svg",
    subcategories: {
      AGUA: {
        label: "Água",
        icon: "/map-icons/agua.svg",
        iconUrl: "/map-icons-fixed/agua.svg",
        iconRetinaUrl: "/map-icons-fixed/agua.svg",
      },
      AGUA_BUEIRO_ABERTO: {
        label: "Bueiro aberto",
        icon: "/map-icons/agua-bueiro-aberto.svg",
      },
      AGUA_BOEIRO_VAZAMENTO: {
        label: "Bueiro vazando",
        icon: "/map-icons/agua-bueiro-vazamento.svg",
      },
      AGUA_CANO_VAZAMENTO: {
        label: "Cano vazando",
        icon: "/map-icons/agua-cano-vazamento.svg",
      },
      AGUA_BOEIRO_ALERTA: {
        label: "Alerta bueiro",
        icon: "/map-icons/agua-bueiro-alerta.svg",
      },
      AGUA_ENCHENTE: {
        label: "Enchente",
        icon: "/map-icons/agua-enchente.svg",
      },
      AGUA_PISTA: {
        label: "Água na pista",
        icon: "/map-icons/agua-pista-alagamento.svg",
      },
    },
  },
  FOGO: {
    label: "Fogo",
    icon: "/map-icons/fogo.svg",
    subcategories: {
      FOGO: {
        label: "Fogo",
        icon: "/map-icons/fogo.svg",
      },
      FOGO_VEICULO: {
        label: "Veículo pegando fogo",
        icon: "/map-icons/fogo-veiculo.svg",
      },
      FOGO_CASA: {
        label: "Casa pegando fogo",
        icon: "/map-icons/fogo-casa.svg",
      },
      FOGO_ARVORE: {
        label: "Árvore pegando fogo",
        icon: "/map-icons/fogo-arvore.svg",
      },
    },
  },
} as const

export const PROBLEM_CATEGORIES: ProblemCategory[] = Object.entries(
  PROBLEM_TYPES,
).map(([key, value]) => ({
  id: key,
  type: key as unknown as ProblemType,
  label: value.label,
  icon: value.icon,
  bgColor: "bg-blue-100",
  mapIcon: {
    iconUrl: value.icon,
    iconRetinaUrl: value.icon,
    shadowUrl: "/map-icons/sombra.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
  subcategories: Object.entries(value.subcategories).map(
    ([key, subcategory]) => ({
      id: key,
      type: subcategory.label,
      label: subcategory.label,
      icon: subcategory.icon,
      iconUrl: subcategory.icon ?? value.icon,
      iconRetinaUrl: subcategory.icon ?? value.icon,
      mapIcon: {
        iconUrl: subcategory.icon ?? value.icon,
        iconRetinaUrl: subcategory.icon ?? value.icon,
        shadowUrl: "/map-icons/sombra.svg",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      },
    }),
  ),
}))

export const DEFAULT_LOCATION: [number, number] = [-23.5902, -48.0338]
export const DEFAULT_ZOOM = 16
export const LOCAL_STORAGE_KEY = "mapProblems"
