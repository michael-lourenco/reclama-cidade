"use client"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import type { UserMarker } from "@/application/entities/User"
import type { Marker } from "@/application/entities/Marker"
import { v4 as uuidv4 } from "uuid"
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { addMarker, dbFirestore } from "@/services/firebase/FirebaseService"
import { toast } from "sonner"
import { PROBLEM_TYPES } from "@/constants/map-constants"

export default function MinhaRota() {
  const { user, loading, status, handleLogin, handleLogout } = useAuth()

  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Logando...</p>
      </div>
    )
  }

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="relative w-full h-screen">
          <MapFullScreen />
        </div>
      ) : (
        <div className="flex flex-col text-primary mb-4 p-4 bg-baclkground rounded-lg">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button onClick={handleLogin} variant="default">
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

const MapFullScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportMenuOpen, setReportMenuOpen] = useState(false)
  const [selectedProblemType, setSelectedProblemType] = useState<string | null>(null)
  const [userConfirmedProblem, setUserConfirmedProblem] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const locationWatchId = useRef<number | null>(null)

  useEffect(() => {
    setIsClient(true)

    // Iniciar monitoramento da localização com alta precisão
    if ("geolocation" in navigator) {
      locationWatchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    }

    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current)
      }
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    if (reportMenuOpen) setReportMenuOpen(false)
  }

  const toggleReportMenu = () => {
    if (!userLocation) {
      alert("É necessário permitir o acesso à sua localização para reportar um problema.")
      return
    }
    setReportMenuOpen(!reportMenuOpen)
  }

  const handleProblemSelect = (problemType: string) => {
    setSelectedProblemType(problemType)
  }

  const handleConfirmProblem = () => {
    if (!userLocation) {
      alert("É necessário permitir o acesso à sua localização para reportar um problema.")
      return
    }
    setUserConfirmedProblem(true)
    setReportMenuOpen(false)
  }

  useEffect(() => {
    if (userConfirmedProblem) {
      const timer = setTimeout(() => {
        setUserConfirmedProblem(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [userConfirmedProblem])

  return (
    <>
      {!isClient || isLoading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Carregando mapa...</span>
        </div>
      ) : null}

      {isClient && (
        <MapContent
          setIsLoading={setIsLoading}
          selectedProblemType={selectedProblemType}
          userConfirmedProblem={userConfirmedProblem}
          resetConfirmation={() => setUserConfirmedProblem(false)}
          userLocation={userLocation}
        />
      )}

      {/* Top Bar - Search */}
      {/* <div className="absolute top-4 left-4 right-4 flex gap-2 z-10">
        <Button
          variant="default"
          size="icon"
          className="bg-white text-black hover:bg-gray-100 shadow-md"
          onClick={toggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Pesquisar localização..."
            className="w-full bg-white shadow-md pr-10"
            onKeyDown={(e) => e.key === "Enter" && console.log("search")}
          />
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div> */}

      {/* Bottom Right - Report Problem Button */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="default"
          size="icon"
          className="bg-white text-black hover:bg-gray-100 shadow-md rounded-full h-12 w-12"
          title="Reportar problema"
          onClick={toggleReportMenu}
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transition-all">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Mapa de Problemas</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Configurações</li>
              <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Ajuda</li>
            </ul>
          </div>
        </div>
      )}

      {/* Report Problem Menu */}
      {reportMenuOpen && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-20 p-4 pb-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Reportar Problema</h3>
            <Button variant="ghost" size="icon" onClick={toggleReportMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Problem type buttons */}
            {Object.entries(PROBLEM_TYPES).map(([key, value]) => (
              <div
                key={key}
                className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedProblemType === value ? "bg-gray-100" : ""}`}
                onClick={() => handleProblemSelect(value)}
              >
                <div
                  className={`bg-${value === PROBLEM_TYPES.BURACO ? "red" : value === PROBLEM_TYPES.ALAGAMENTO ? "yellow" : "blue"}-100 p-2 rounded-full mb-2`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 text-${value === PROBLEM_TYPES.BURACO ? "red" : value === PROBLEM_TYPES.ALAGAMENTO ? "yellow" : "blue"}-500`}
                  />
                </div>
                <span className="text-xs">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 pt-2 pb-4 bg-white">
            <Button className="w-full text-black" disabled={!selectedProblemType} onClick={handleConfirmProblem}>
              Confirmar Problema
            </Button>
          </div>
        </div>
      )}

      {!userLocation && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm text-red-500">
            Ative a localização para reportar problemas
          </div>
        </div>
      )}
    </>
  )
}

const MapContent = ({
  setIsLoading,
  selectedProblemType,
  userConfirmedProblem,
  resetConfirmation,
  userLocation,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: string | null
  userConfirmedProblem: boolean
  resetConfirmation: () => void
  userLocation: [number, number] | null
}) => {
  const { user } = useAuth()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const iconsRef = useRef<Record<string, any>>({})
  const markersLayerRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastUserLocation = useRef<[number, number] | null>(null)
  const [showOnlyUserMarkers, setShowOnlyUserMarkers] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const defaultLocation: [number, number] = [-23.5902, -48.0338]
  const defaultZoom = 15
  const LOCAL_STORAGE_KEY = "mapProblems"

  // Função para calcular a distância entre dois pontos em metros
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3 // raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // em metros
  }, [])

  // Função para verificar se o usuário pode curtir um marcador
  const canLikeMarker = useCallback(
    (marker: Marker): boolean => {
      if (!user || !user.email || !userLocation) return false

      // Usuário não pode curtir seu próprio marcador
      if (marker.userEmail === user.email) return false

      // Verificar se o usuário já curtiu este marcador
      const likedBy = marker.likedBy || []
      if (likedBy.includes(user.email)) return false

      // Verificar se o usuário está a menos de 100 metros do marcador
      const distance = calculateDistance(userLocation[0], userLocation[1], marker.lat, marker.lng)

      return distance <= 100 // retorna true se estiver a menos de 100 metros
    },
    [user, userLocation, calculateDistance],
  )

  // Função para curtir um marcador
  const likeMarker = useCallback(
    async (markerId: string) => {
      if (!user || !user.email) {
        toast.error("Você precisa estar logado para curtir um marcador.")
        return
      }

      try {
        const markerRef = doc(dbFirestore, "markers", markerId)
        const markerDoc = await getDoc(markerRef)

        if (!markerDoc.exists()) {
          toast.error("Marcador não encontrado.")
          return
        }

        const markerData = markerDoc.data() as Marker

        // Verificar se o usuário pode curtir este marcador
        if (!canLikeMarker({ ...markerData, id: markerId })) {
          toast.error("Você precisa estar a menos de 100 metros do marcador ou não pode curtir seu próprio marcador.")
          return
        }

        // Adicionar o email do usuário ao array de curtidas
        await updateDoc(markerRef, {
          likedBy: arrayUnion(user.email),
        })

        toast.success("Você curtiu este marcador!")

        // Recarregar marcadores para atualizar a interface
        await loadMarkers()
      } catch (error) {
        console.error("Erro ao curtir marcador:", error)
        toast.error("Ocorreu um erro ao curtir o marcador.")
      }
    },
    [user, canLikeMarker],
  )

  // Função para descurtir um marcador
  const unlikeMarker = useCallback(
    async (markerId: string) => {
      if (!user || !user.email) return

      try {
        const markerRef = doc(dbFirestore, "markers", markerId)

        // Remover o email do usuário do array de curtidas
        await updateDoc(markerRef, {
          likedBy: arrayRemove(user.email),
        })

        toast.success("Você removeu sua curtida deste marcador.")

        // Recarregar marcadores para atualizar a interface
        await loadMarkers()
      } catch (error) {
        console.error("Erro ao descurtir marcador:", error)
        toast.error("Ocorreu um erro ao remover sua curtida.")
      }
    },
    [user],
  )

  const getProblemLabel = useCallback((type: string): string => {
    switch (type) {
      case PROBLEM_TYPES.BURACO:
        return "Buraco"
      case PROBLEM_TYPES.ALAGAMENTO:
        return "Alagamento"
      case PROBLEM_TYPES.ILUMINACAO:
        return "Iluminação"
      default:
        return "Desconhecido"
    }
  }, [])

  // Nova função para atualizar apenas o marcador de localização do usuário
  const updateUserLocationMarker = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current || !userLocation) return

    const L = leafletRef.current

    // Se o marcador não existir, crie-o
    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.marker(userLocation, {
        icon: iconsRef.current.default,
      }).addTo(mapInstanceRef.current)

      currentMarkerRef.current.bindPopup("Sua localização atual")
      lastUserLocation.current = userLocation
      return
    }

    // Se a localização mudou, use flyTo para mover o mapa suavemente
    if (
      lastUserLocation.current &&
      (lastUserLocation.current[0] !== userLocation[0] || lastUserLocation.current[1] !== userLocation[1])
    ) {
      // Atualizar a posição do marcador
      currentMarkerRef.current.setLatLng(userLocation)
      
      // Verificar se o marcador está fora da vista e usar flyTo para centralizar o mapa
      if (!mapInstanceRef.current.getBounds().contains(userLocation)) {
        mapInstanceRef.current.flyTo(userLocation, mapInstanceRef.current.getZoom(), {
          duration: 0.5,
          easeLinearity: 0.25
        });
      }
      
      // Atualizar a última posição conhecida
      lastUserLocation.current = userLocation
    } else {
      // Primeira atualização ou mesma posição, apenas definir a posição
      currentMarkerRef.current.setLatLng(userLocation)
      lastUserLocation.current = userLocation
    }
  }, [userLocation])

  // Função otimizada para carregar marcadores sem causar piscadas
  const loadMarkers = useCallback(async () => {
    try {
      if (!mapInstanceRef.current || !leafletRef.current) return

      const L = leafletRef.current

      // Criar uma nova camada de marcadores se não existir
      if (!markersLayerRef.current) {
        markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current)
      }

      const markersRef = collection(dbFirestore, "markers")
      const q =
        showOnlyUserMarkers && user?.email ? query(markersRef, where("userEmail", "==", user.email)) : query(markersRef)

      const querySnapshot = await getDocs(q)
      const loadedMarkers: Marker[] = []

      // Limpar marcadores antigos da camada sem afetar o marcador de localização
      markersLayerRef.current.clearLayers()

      querySnapshot.forEach((doc) => {
        const markerData = { id: doc.id, ...doc.data() } as Marker
        loadedMarkers.push(markerData)

        // Adicionar marcador à camada de marcadores
        const icon = iconsRef.current[markerData.type] || iconsRef.current.default
        const mapMarker = L.marker([markerData.lat, markerData.lng], {
          icon,
        })

        const date =
          markerData.createdAt instanceof Timestamp ? markerData.createdAt.toDate() : new Date(markerData.createdAt)

        // Verificar se o usuário pode curtir este marcador
        const userCanLike = canLikeMarker(markerData)

        // Verificar se o usuário já curtiu este marcador
        const likedBy = markerData.likedBy || []
        const userHasLiked = user?.email && likedBy.includes(user.email)

        // Contar o número de curtidas
        const likesCount = likedBy.length

        // Criar o conteúdo do popup com botão de curtir
        let popupContent = `
          <strong>Problema: ${getProblemLabel(markerData.type)}</strong><br>
          Reportado em: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}<br>
          <div class="likes-container" style="margin-top: 8px; display: flex; align-items: center;">
            <span style="margin-right: 5px;">Curtidas: ${likesCount}</span>
        `

        // Adicionar botão de curtir/descurtir se o usuário estiver logado
        if (user?.email) {
          if (userHasLiked) {
            popupContent += `
              <button 
                class="unlike-button" 
                data-marker-id="${markerData.id}" 
                style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 4px 8px; display: flex; align-items: center; cursor: pointer;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-right: 4px;">
                  <path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                Curtido
              </button>
            `
          } else if (userCanLike) {
            popupContent += `
              <button 
                class="like-button" 
                data-marker-id="${markerData.id}" 
                style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 4px 8px; display: flex; align-items: center; cursor: pointer;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-right: 4px;">
                  <path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                Curtir
              </button>
            `
          } else if (markerData.userEmail === user.email) {
            popupContent += `
              <span style="font-size: 12px; color: #6c757d; margin-left: 5px;">(Seu marcador)</span>
            `
          } else {
            popupContent += `
              <span style="font-size: 12px; color: #6c757d; margin-left: 5px;">(Aproxime-se para curtir)</span>
            `
          }
        }

        popupContent += `</div>`

        mapMarker.bindPopup(popupContent)

        // Adicionar evento para o botão de curtir
        mapMarker.on("popupopen", () => {
          setTimeout(() => {
            const likeButton = document.querySelector(".like-button")
            if (likeButton) {
              likeButton.addEventListener("click", (e) => {
                e.preventDefault()
                const markerId = (e.currentTarget as HTMLElement).getAttribute("data-marker-id")
                if (markerId) {
                  likeMarker(markerId)
                }
              })
            }

            const unlikeButton = document.querySelector(".unlike-button")
            if (unlikeButton) {
              unlikeButton.addEventListener("click", (e) => {
                e.preventDefault()
                const markerId = (e.currentTarget as HTMLElement).getAttribute("data-marker-id")
                if (markerId) {
                  unlikeMarker(markerId)
                }
              })
            }
          }, 100)
        })

        markersLayerRef.current.addLayer(mapMarker)
      })

      setMarkers(loadedMarkers)
    } catch (error) {
      console.error("Erro ao carregar marcadores:", error)
    }
  }, [showOnlyUserMarkers, user?.email, getProblemLabel, canLikeMarker, likeMarker, unlikeMarker])

  const saveMarkerToLocalStorage = useCallback(
    async (markerData: UserMarker) => {
      try {
        // Salvar no localStorage
        const existingMarkers = localStorage.getItem(LOCAL_STORAGE_KEY)
        const markers: UserMarker[] = existingMarkers ? JSON.parse(existingMarkers) : []
        markers.push(markerData)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(markers))

        // Salvar no Firebase
        if (user?.email) {
          const markerDataForFirebase: Marker = {
            id: markerData.id,
            lat: markerData.lat,
            lng: markerData.lng,
            type: markerData.type,
            userEmail: user.email,
            createdAt: markerData.createdAt,
            likedBy: [], // Inicializar o array de curtidas vazio
          }

          await addMarker(dbFirestore, markerDataForFirebase)
          await loadMarkers() // Recarregar marcadores após adicionar novo
        }
      } catch (error) {
        console.error("Erro ao salvar marcador:", error)
      }
    },
    [user?.email, loadMarkers],
  )

  // Effect para atualizar o menu com o toggle de marcadores
  useEffect(() => {
    const menuContent = document.querySelector(".p-4 ul")
    if (menuContent) {
      const toggleButton = document.createElement("li")
      toggleButton.className = "p-2 hover:bg-gray-100 rounded cursor-pointer"
      toggleButton.textContent = showOnlyUserMarkers ? "Mostrar Todos os Marcadores" : "Mostrar Apenas Meus Marcadores"
      toggleButton.onclick = () => setShowOnlyUserMarkers((prev) => !prev)

      // Adicionar após "Meus Reportes"
      const firstItem = menuContent.firstChild
      if (firstItem) {
        menuContent.insertBefore(toggleButton, firstItem.nextSibling)
      }
    }
  }, [showOnlyUserMarkers])

  // Initialize map
  useEffect(() => {
    const addLeafletCSS = () => {
      if (document.querySelector('link[href*="leaflet.css"]')) return

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    const addMarkerStyles = () => {
      if (document.querySelector('style[data-id="marker-styles"]')) return

      const style = document.createElement("style")
      style.dataset.id = "marker-styles"
      style.textContent = `
        .buraco-icon { filter: hue-rotate(320deg); }
        .alagamento-icon { filter: hue-rotate(60deg); }
        .iluminacao-icon { filter: hue-rotate(240deg); }
        
        /* Adicionar classe para animação do marcador do usuário */
        .user-location-marker {
          transition: transform 0.3s ease-out;
        }
        
        /* Desativar animações padrão do Leaflet para evitar piscadas */
        .leaflet-fade-anim .leaflet-tile,
        .leaflet-zoom-anim .leaflet-zoom-animated {
          will-change: auto !important;
        }
        
        /* Estilos para os botões de curtir */
        .like-button, .unlike-button {
          transition: all 0.2s ease;
        }
        .like-button:hover, .unlike-button:hover {
          background-color: #e9ecef !important;
        }
        .likes-container {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
      `
      document.head.appendChild(style)
    }

    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        addLeafletCSS()
        addMarkerStyles()

        if (!leafletRef.current) {
          const L = await import("leaflet")
          leafletRef.current = L
        }

        const L = leafletRef.current

        // Create custom icons
        if (Object.keys(iconsRef.current).length === 0) {
          const createIcon = (className = "") =>
            new L.Icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
              className,
            })

          const holeIcon = L.icon({
            iconUrl: "hole.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

            iconSize: [41, 41],
            shadowSize: [70, 40],
            iconAnchor: [22, 41],
            popupAnchor: [1, -34],
          })

          const floodIcon = L.icon({
            iconUrl: "flood.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

            iconSize: [41, 41],
            shadowSize: [70, 40],
            iconAnchor: [22, 41],
            popupAnchor: [1, -34],
          })

          const lightIcon = L.icon({
            iconUrl: "spotlight.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

            iconSize: [41, 41],
            shadowSize: [70, 40],
            iconAnchor: [22, 41],
            popupAnchor: [1, -34],
          })

          iconsRef.current = {
            [PROBLEM_TYPES.BURACO]: holeIcon,
            [PROBLEM_TYPES.ALAGAMENTO]: floodIcon,
            [PROBLEM_TYPES.ILUMINACAO]: lightIcon,
            default: createIcon("user-location-marker"), // Adicionar classe para o marcador do usuário
          }
        }

        // Initialize map with user location or default location
        const initialLocation = userLocation || defaultLocation
        const mapInstance = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          // Desativar animações do mapa para evitar piscadas
          fadeAnimation: false,
          zoomAnimation: false,
          markerZoomAnimation: false,
          // Melhorar desempenho
          preferCanvas: true,
        }).setView(initialLocation, defaultZoom)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapInstance)

        mapInstanceRef.current = mapInstance

        // Criar camada de marcadores
        markersLayerRef.current = L.layerGroup().addTo(mapInstance)

        // Carregar marcadores iniciais
        await loadMarkers()

        // Atualizar marcador de localização inicial
        if (userLocation) {
          lastUserLocation.current = userLocation
          updateUserLocationMarker()
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loadMarkers, userLocation, updateUserLocationMarker])

  // Atualizar apenas o marcador de localização quando a posição mudar
  useEffect(() => {
    if (userLocation) {
      updateUserLocationMarker()
    }
  }, [userLocation, updateUserLocationMarker])

  // Carregar marcadores apenas quando necessário
  useEffect(() => {
    if (mapInstanceRef.current) {
      loadMarkers()
    }
  }, [loadMarkers, showOnlyUserMarkers])

  // Handle confirmed problem selection and marker update
  useEffect(() => {
    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !userLocation ||
      !leafletRef.current
    ) {
      return
    }

    const L = leafletRef.current

    // Criar marcador de problema sem animação
    const newMarker = L.marker(userLocation, {
      icon: iconsRef.current[selectedProblemType],
    }).addTo(markersLayerRef.current)

    newMarker.bindPopup(`Problema: ${getProblemLabel(selectedProblemType)}`).openPopup()

    if (user && user.email) {
      const userMarkerData: UserMarker = {
        id: uuidv4(),
        lat: userLocation[0],
        lng: userLocation[1],
        type: selectedProblemType,
        createdAt: new Date(),
      }
    if (user && user.email) {
      const userMarkerData: UserMarker = {
        id: uuidv4(),
        lat: userLocation[0],
        lng: userLocation[1],
        type: selectedProblemType,
        createdAt: new Date(),
      }

      saveMarkerToLocalStorage(userMarkerData)
    }

    resetConfirmation()
  }}, [
    userConfirmedProblem,
    selectedProblemType,
    getProblemLabel,
    saveMarkerToLocalStorage,
    resetConfirmation,
    user,
    userLocation,
  ])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
}

