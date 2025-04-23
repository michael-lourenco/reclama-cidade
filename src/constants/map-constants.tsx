// src/constants/map-constants.ts

import { ProblemCategory, ProblemType } from "@/components/map/types/map"

export type TProblemType = keyof typeof PROBLEM_TYPES
export type TProblemSubcategory =
  keyof (typeof PROBLEM_TYPES)[keyof typeof PROBLEM_TYPES]["subcategories"]

export const PROBLEM_TYPES = {
  POLICIA: {
    label: "Polícia",
    icon: "/map-icons/policia.png",
    subcategories: {
      POLICIA: {
        label: "Polícia",
        icon: "/map-icons/policia.png",
      },
      BAFOMETRO: {
        label: "Bafômetro",
        icon: "/map-icons/bafometro.png",
      },
      TIROTEIO: {
        label: "Tiroteio",
        icon: "/map-icons/tiroteio.png",
      },
      BLITZ: {
        label: "Blitz",
        icon: "/map-icons/blitz.png",
      },
      SOM_ALTO: {
        label: "SOM ALTO",
        icon: "/map-icons/som-alto.png",
      },
    },
  },
  INFRAESTRUTURA: {
    label: "Infraestrutura",
    icon: "/map-icons/iluminacao.png",
    subcategories: {
      INFRAESTRUTURA: {
        label: "Infraestrutura",
        icon: "/map-icons/iluminacao.png",
      },
      INFRAESTRUTURA_ILUMINACAO_PUBLICA: {
        label: "Iluminação Pública",
        icon: "/map-icons/iluminacao-publica.png",
      },
      INFRAESTRUTURA_SEMAFORO: {
        label: "Semáforo",
        icon: "/map-icons/semaforo.png",
      },
      INFRAESTRUTURA_PLACA_QUEBRADA: {
        label: "Placa Quebrada",
        icon: "/map-icons/placa-quebrada.png",
      },
      INFRAESTRUTURA_MATO_ALTO: {
        label: "Mato Alto",
        icon: "/map-icons/mato-alto.png",
      },
    },
  },
  PISTA: {
    label: "Pista",
    icon: "/map-icons/pista.png",
    subcategories: {
      PISTA: {
        label: "Pista",
        icon: "/map-icons/pista.png",
      },
      PISTA_OBJETO: {
        label: "Objeto na pista",
        icon: "/map-icons/pista-objeto.png",
      },
      PISTA_OLEO: {
        label: "Óleo na pista",
        icon: "/map-icons/pista-oleo.png",
      },
      PISTA_ARVORE: {
        label: "Árvore na pista",
        icon: "/map-icons/pista-arvore.png",
      },
      PISTA_ALERTA: {
        label: "Alerta na pista",
        icon: "/map-icons/pista-alerta.png",
      },
      PISTA_POSTE: {
        label: "Quebra de poste",
        icon: "/map-icons/pista-poste.png",
      },
      PISTA_VEICULO_ABANDONADO: {
        label: "Veículo abandonado",
        icon: "/map-icons/pista-veiculo-abandonado.png",
      },
    },
  },
  AGUA: {
    label: "Água",
    icon: "/map-icons/agua.png",
    subcategories: {
      AGUA: {
        label: "Água",
        icon: "/map-icons/agua.png",
        iconUrl: "/map-icons-fixed/agua.png",
        iconRetinaUrl: "/map-icons-fixed/agua.png",
      },
      AGUA_BUEIRO_ABERTO: {
        label: "Bueiro aberto",
        icon: "/map-icons/agua-bueiro-aberto.png",
      },
      AGUA_BOEIRO_VAZAMENTO: {
        label: "Bueiro vazando",
        icon: "/map-icons/agua-bueiro-vazamento.png",
      },
      AGUA_CANO_VAZAMENTO: {
        label: "Cano vazando",
        icon: "/map-icons/agua-cano-vazamento.png",
      },
      AGUA_BOEIRO_ALERTA: {
        label: "Alerta bueiro",
        icon: "/map-icons/agua-bueiro-alerta.png",
      },
      AGUA_ENCHENTE: {
        label: "Enchente",
        icon: "/map-icons/agua-enchente.png",
      },
      AGUA_PISTA: {
        label: "Água na pista",
        icon: "/map-icons/agua-pista-alagamento.png",
      },
    },
  },
  FOGO: {
    label: "Fogo",
    icon: "/map-icons/fogo.png",
    subcategories: {
      FOGO: {
        label: "Fogo",
        icon: "/map-icons/fogo.png",
      },
      FOGO_VEICULO: {
        label: "Veículo pegando fogo",
        icon: "/map-icons/fogo-veiculo.png",
      },
      FOGO_CASA: {
        label: "Casa pegando fogo",
        icon: "/map-icons/fogo-casa.png",
      },
      FOGO_ARVORE: {
        label: "Árvore pegando fogo",
        icon: "/map-icons/fogo-arvore.png",
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
    shadowUrl: "/map-icons/sombra.png",
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
        shadowUrl: "/map-icons/sombra.png",
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
