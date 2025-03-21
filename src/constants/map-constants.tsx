// Define tipos para os problemas
const PROBLEM_TYPES = {
    BURACO: "buraco",
    ALAGAMENTO: "alagamento",
    ILUMINACAO: "iluminacao",
} as const

type ProblemType = (typeof PROBLEM_TYPES)[keyof typeof PROBLEM_TYPES]

const LOCAL_STORAGE_KEY = "mapProblems"

const DEFAULT_LOCATION: [number, number] = [-23.5902, -48.0338]
const DEFAULT_ZOOM = 18

export {
    PROBLEM_TYPES,
    LOCAL_STORAGE_KEY,
    DEFAULT_LOCATION,
    DEFAULT_ZOOM
}