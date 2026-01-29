// components/ui/FlightDetailsCard.jsx
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"
import { Plane, Calendar, Package, Utensils, Tag } from "lucide-react"
import { Separator } from "./Separator"

export const FlightDetailsCard = ({ 
  airline = "FlyJinnah",
  flightNumber = "9P 764",
  date = "05 Feb",
  route = "ISB-BAH",
  departureTime = "18:55",
  arrivalTime = "21:05",
  baggage = "20+07-KG",
  depDate = "5 Feb 2026",
  meal = "No",
  adultPrice = "PKR 94,000",
  infantPrice = "Price On Call"
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{airline}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Booking Details
              </div>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Tag className="h-3 w-3" />
            Flight Details
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sector Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Sector Information</h3>
          </div>
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Flight</div>
              <div className="text-lg font-bold">{flightNumber}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="text-lg font-bold">{date}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Route</div>
              <div className="text-lg font-bold">{route}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="text-lg font-bold">
                {departureTime} - {arrivalTime}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Baggage</div>
              <div className="text-lg font-bold">{baggage}</div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Flight Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dep Date</span>
            </div>
            <div className="text-lg font-bold pl-6">{depDate}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Meal</span>
            </div>
            <div className="text-lg font-bold pl-6">{meal}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Baggage</span>
            </div>
            <div className="text-lg font-bold pl-6">{baggage}</div>
          </div>
        </div>
        
        <Separator />
        
        {/* Pricing Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Pricing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Adult Price</div>
              <div className="text-xl font-bold text-primary">{adultPrice}</div>
            </div>
                        
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Infant</div>
              <div className="text-lg font-bold">{infantPrice}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}