
import type { ProblemCategory, ProblemSubcategory } from "@/components/map/types/map"
import { PROBLEM_CATEGORIES } from "@/constants/map-constants"

// Refactored function to create icons dynamically using mapIcon config from each category/subcategory
export const createMapIcons = (L: any) => {
  // Default base configuration for unconfigured icons
  const baseIconConfig = {
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }

  // Default icon for unmapped cases
  const defaultIcon = new L.Icon(baseIconConfig)

  // User location icon
  const userLocationIcon = new L.Icon({
    ...baseIconConfig,
    className: "user-location-icon",
  })

  // Initialize the icons object with default icons
  const icons: Record<string, any> = {
    default: defaultIcon,
    userLocation: userLocationIcon,
  }

  // Process all main categories
  PROBLEM_CATEGORIES.forEach((category: ProblemCategory) => {
    // Create icon for the main category using its mapIcon configuration
    icons[category.type] = new L.Icon({
      ...(category.mapIcon || baseIconConfig),
      className: `${category.id.toLowerCase()}-icon`,
    })

    // Process subcategories if they exist
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subCategory: ProblemSubcategory) => {
        // Create icon for each subcategory using its mapIcon configuration
        icons[subCategory.type] = new L.Icon({
          ...(subCategory.mapIcon || category.mapIcon || baseIconConfig),
          className: `${subCategory.id.toLowerCase()}-icon`,
        })
      })
    }
  })

  return icons
}
