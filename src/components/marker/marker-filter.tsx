"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Filter } from "lucide-react"

interface MarkerFilterProps {
  availableTypes: string[]
  selectedTypes: string[]
  onFilterChange: (selectedTypes: string[]) => void
}

export function MarkerFilter({ availableTypes, selectedTypes, onFilterChange }: MarkerFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleFilter = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        size="sm"
        variant="secondary"
        className="mb-2 shadow-md"
        onClick={toggleFilter}
      >
        <Filter size={18} className="mr-1" />
        {selectedTypes.length > 0 && (
          <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center ml-1">
            {selectedTypes.length}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="p-3 bg-secondary rounded-lg shadow-md w-64">
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
      )}
    </div>
  )
}