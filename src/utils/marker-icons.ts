import { PROBLEM_CATEGORIES } from "@/config/problem-categories"
import type { ProblemCategory, ProblemSubcategory } from "@/types/map"

// Função refatorada para criar ícones de forma dinâmica baseado nos dados de PROBLEM_CATEGORIES
export const createMapIcons = (L: any) => {
  // Configuração base para todos os ícones
  const baseIconConfig = {
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }

  // Ícone padrão para casos não mapeados
  const defaultIcon = new L.Icon(baseIconConfig)
  
  // Ícone para localização do usuário
  const userLocationIcon = new L.Icon({
    ...baseIconConfig,
    className: "user-location-icon",
  })
  
  // Inicializa o objeto de ícones com os ícones padrão
  const icons: Record<string, any> = {
    default: defaultIcon,
    userLocation: userLocationIcon,
  }
  
  // Função para criar um ícone com base no tipo do problema
  const createIconForType = (type: string, className: string) => {
    return new L.Icon({
      ...baseIconConfig,
      className: `${className}-icon`,
    })
  }

  // Processa todas as categorias principais
  PROBLEM_CATEGORIES.forEach((category: ProblemCategory) => {
    // Cria ícone para a categoria principal
    icons[category.type] = createIconForType(category.type, category.id.toLowerCase())
    
    // Processa subcategorias se existirem
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subCategory: ProblemSubcategory) => {
        // Cria ícone para cada subcategoria
        icons[subCategory.type] = createIconForType(subCategory.type, subCategory.id.toLowerCase())
      })
    }
  })

  return icons
}