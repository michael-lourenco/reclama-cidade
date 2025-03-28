"use client"
import type { Marker } from "@/application/entities/Marker"
import { getProblemLabel } from "@/utils/map-utils"
import { useCallback } from "react"

// Função utilitária para conversão de timestamps
const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }

  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    // Firestore Timestamp object
    return new Date(timestamp.seconds * 1000)
  }

  // Fallback para outros formatos de timestamp
  return new Date(timestamp)
}

export const useMarkerPopup = () => {
  // Adicionar novos estilos para o botão de like
  const addLikeStyles = useCallback(() => {
    if (document.querySelector('style[data-id="like-styles"]')) return

    const style = document.createElement("style")
    style.dataset.id = "like-styles"
    style.textContent = `
      .marker-popup .like-button {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .marker-popup .like-button:hover {
        background-color: #e0e0e0;
      }
      .marker-popup .like-count {
        margin-left: 5px;
        font-weight: bold;
      }
    `
    document.head.appendChild(style)
  }, [])

  // Criar conteúdo do popup para um marcador existente
  const createExistingMarkerPopup = (marker: Marker, onLike: (marker: Marker) => void) => {
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
      onLike(marker)
    })

    return popupContent
  }

  // Criar conteúdo do popup para um novo marcador
  const createNewMarkerPopup = (problemType: string, userEmail: string) => {
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

    return popupContent
  }

  return {
    addLikeStyles,
    createExistingMarkerPopup,
    createNewMarkerPopup,
    convertToDate,
  }
}

