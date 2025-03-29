"use client"

import { useCallback } from "react"

// Função para adicionar estilos CSS para os marcadores do mapa
export const useMarkerStyles = () => {
  return useCallback(() => {
    if (document.querySelector('style[data-id="marker-styles"]')) return

    const style = document.createElement("style")
    style.dataset.id = "marker-styles"
    style.textContent = `
      .buraco-icon {
        filter: hue-rotate(320deg); /* Vermelho */
      }
      .alagamento-icon {
        filter: hue-rotate(60deg); /* Amarelo */
      }
      .iluminacao-icon {
        filter: hue-rotate(240deg); /* Azul */
      }
      .user-location-icon {
        filter: hue-rotate(120deg);
        animation: pulse 1.5s infinite;
      }
      .blitz-icon {
        filter: hue-rotate(300deg);
      }
      .pista-icon {
        filter: hue-rotate(50deg);
      }
      .bueiro-aberto-icon {
        filter: hue-rotate(270deg) brightness(1.2) contrast(1.5);
      }
      .bueiro-vazamento-icon {
        filter: hue-rotate(120deg);
      }
      .semafaro-icon {
        filter: hue-rotate(180deg) brightness(1.2) contrast(1.5);
      }
          
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `
    document.head.appendChild(style)
  }, [])
}

