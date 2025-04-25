
import { useCallback } from "react"

export function useGeolocation() {
    const centerOnUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    // We'll use a custom event to communicate with the MapContent component
                    const event = new CustomEvent("centerOnUser", {
                        detail: { lat: latitude, lng: longitude },
                    })
                    document.dispatchEvent(event)
                },
                (error) => {
                    console.error("Erro ao obter localização do usuário:", error)
                }
            )
        }
    }, [])

    return { centerOnUserLocation }
}
