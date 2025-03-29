import type { Marker } from "@/types/marker-types"
import { addMarker, dbFirestore } from "@/services/firebase/FirebaseService"
import { getProblemLabel } from "@/utils/map-utils"
import { convertToDate } from "@/utils/marker-interactions"

/**
 * Função para adicionar um novo marcador ao mapa e ao Firebase
 */
export const addNewMarker = async ({
  position,
  problemType,
  leaflet,
  mapInstance,
  icons,
  setMarkers,
}: {
  position: { lat: number; lng: number }
  problemType: string
  leaflet: any
  mapInstance: any
  icons: Record<string, any>
  setMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void
}): Promise<Marker | null> => {
  try {
    // Obter informações do usuário atual do localStorage
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null
    const userEmail = userData?.email || "Usuário anônimo"

    // Criar objeto de marcador para salvar
    const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const newMarkerData: Marker = {
      id: markerId,
      lat: position.lat,
      lng: position.lng,
      type: problemType,
      userEmail,
      createdAt: new Date(),
      likedBy: [], // Inicializa como um array vazio
    }

    // Adicionar ao Firebase usando o FirebaseService
    await addMarker(dbFirestore, newMarkerData)
    console.log("Marcador salvo com sucesso:", newMarkerData)

    // Atualizar o estado local de marcadores
    setMarkers((prev) => [...prev, newMarkerData])

    // Adicionar marker no mapa com o ícone correto
    const newMarker = leaflet
      .marker([position.lat, position.lng], {
        icon: icons[problemType],
      })
      .addTo(mapInstance)

    // Criar popup personalizado com botão de like
    const popupContent = document.createElement("div")
    popupContent.classList.add("marker-popup")
    popupContent.innerHTML = `
     <strong>Problema: ${getProblemLabel(problemType)}</strong><br>
     Reportado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}<br>
     Por: ${userEmail}<br>
     <button class="like-button">
       Curtir 
       <span class="like-count">(0)</span>
     </button>
   `

    newMarker.bindPopup(popupContent).openPopup()

    return newMarkerData
  } catch (error) {
    console.error("Erro ao salvar marcador no Firebase:", error)
    return null
  }
}

/**
 * Função para criar o conteúdo do popup de um marcador
 */
export const createMarkerPopupContent = (marker: Marker, onLikeClick: (marker: Marker) => void): HTMLElement => {
  const createdAt = convertToDate(marker.createdAt)

  const popupContent = document.createElement("div")
  popupContent.classList.add("marker-popup")
  popupContent.innerHTML = `
    <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
    Reportado em: ${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}<br>
    Por: ${marker.userEmail || "Usuário anônimo"}<br>
    <button class="like-button">
      Curtir 
      <span class="like-count">(${marker.likedBy?.length || 0})</span>
    </button>
  `

  // Adicionar evento de clique no botão de like
  popupContent.querySelector(".like-button")?.addEventListener("click", () => {
    onLikeClick(marker)
  })

  return popupContent
}

