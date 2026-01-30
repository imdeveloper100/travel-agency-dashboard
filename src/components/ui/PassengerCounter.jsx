// components/ui/PassengerCounter.jsx
import * as React from "react"
import { Button } from "./Button"
import { Minus, Plus } from "lucide-react"
import { Label } from "./Label"

export const PassengerCounter = ({ 
  type = "Adult", 
  price = "PKR 0", 
  count = 0, 
  onChange,
  max = 9,
  description = ""
}) => {
  const handleIncrement = () => {
    if (count < max) {
      onChange(type, count + 1)
    }
  }

  const handleDecrement = () => {
    if (count > 0) {
      onChange(type, count - 1)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 hover:border-accent-light transition-all duration-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div>
            <div className="font-medium">{type}</div>
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 text-center">
        <div className="font-medium">{price}</div>
        <div className="text-sm text-muted-foreground">Per {type.toLowerCase()}</div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={count === 0}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="w-12 text-center">
            <div className="text-xl font-bold">{count}</div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={count >= max}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 text-right">
        <div className="text-xl font-bold">
          {type === "Adult" && price !== "Price On Call" 
            ? `PKR ${(parseInt(price.replace(/[^0-9]/g, '')) * count).toLocaleString()}`
            : "-"}
        </div>
      </div>
    </div>
  )
}