import React from 'react'
import {
  X,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'


const AIRLINES = [
  { id: 'fly-jinnah', label: 'FLY JINNAH', code: 'FJ' },
  { id: 'air-sial', label: 'AIR SIAL', code: 'AS' },
  { id: 'air-arabia', label: 'AIR ARABIA', code: 'AA' },
  { id: 'emirates', label: 'EMIRATES', code: 'EK' },
  { id: 'qatar', label: 'QATAR AIRWAYS', code: 'QR' },
  { id: 'etihad', label: 'ETIHAD', code: 'EY' },
]

const FilterPanel = ({
  selectedAirlines,
  onAirlineChange,
  onClearFilters,
}) => {
  return (
    <div className="w-full border-b border-border pb-4">
      <div className="">
        <div className="flex items-center justify-between">
          {selectedAirlines.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              FILTERS AIRLINES
            </h4>
            <div className="flex flex-wrap gap-4">
              {AIRLINES.map((airline) => (
                <label
                  key={airline.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedAirlines.includes(airline.id)}
                    onCheckedChange={(checked) =>
                      onAirlineChange(airline.id, checked === true)
                    }
                  />
                  <span className="text-sm group-hover:text-foreground text-foreground/80 transition-colors">
                    {airline.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel