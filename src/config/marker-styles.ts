import { MarkerStylesMap } from "@/types/map";
import { PROBLEM_TYPES } from "@/constants/map-constants";

export const MARKER_STYLES: MarkerStylesMap = {
    [PROBLEM_TYPES.BURACO]: "filter: hue-rotate(320deg);", // Vermelho
    [PROBLEM_TYPES.ALERTA]: "filter: hue-rotate(60deg);", // Amarelo
    [PROBLEM_TYPES.CANO_QUEBRADO]: "filter: hue-rotate(300deg);",
    [PROBLEM_TYPES.ILUMINACAO]: "filter: hue-rotate(240deg);", // Azul
    [PROBLEM_TYPES.INCENDIO]: "filter: hue-rotate(240deg);",
    [PROBLEM_TYPES.INCENDIO_CARRO]: "filter: hue-rotate(240deg);",
    [PROBLEM_TYPES.INCENDIO_CASA]: "filter: hue-rotate(240deg);",
    [PROBLEM_TYPES.INCENDIO_FLORESTA]: "filter: hue-rotate(240deg);",
    [PROBLEM_TYPES.HIDRAULICA]: "filter: hue-rotate(300deg);",
    [PROBLEM_TYPES.BLITZ]: "filter: hue-rotate(300deg);",
    
    [PROBLEM_TYPES.PISTA]: "filter: hue-rotate(50deg);",
    [PROBLEM_TYPES.BUEIRO_ABERTO]: "filter: hue-rotate(270deg) brightness(1.2) contrast(1.5);",
    [PROBLEM_TYPES.BUEIRO_VAZAMENTO]: "filter: hue-rotate(120deg);",
    [PROBLEM_TYPES.SEMAFARO]: "filter: hue-rotate(180deg) brightness(1.2) contrast(1.5);",
    [PROBLEM_TYPES.TIROTEIO]: "filter: hue-rotate(180deg) brightness(1.2) contrast(1.5);",
    userLocation: "filter: hue-rotate(120deg); animation: pulse 1.5s infinite;",
};