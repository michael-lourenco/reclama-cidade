"use client"

import { Button } from "@/components/ui/button"

interface MarkerFilterProps {
  availableTypes: string[]
  selectedTypes: string[]
  onFilterChange: (selectedTypes: string[]) => void
}

export function MarkerFilter({ availableTypes, selectedTypes, onFilterChange }: MarkerFilterProps) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <h3 className="text-sm font-medium mb-2">Filtrar por tipo:</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedTypes.length === 0 ? "default" : "outline"}
          onClick={() => onFilterChange([])}
        >
          Todos
        </Button>
        {availableTypes.map((type) => (
          <Button
            key={type}
            size="sm"
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            onClick={() => {
              if (selectedTypes.includes(type)) {
                onFilterChange(selectedTypes.filter((t) => t !== type))
              } else {
                onFilterChange([...selectedTypes, type])
              }
            }}
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  )
}