// components/ui/PassengersTable.jsx
import * as React from "react"
import { PassengerRow } from "./PassenderRow"

export const PassengersTable = ({ 
  passengers = { adult: 0, child: 0, infant: 0 },
  onPassengerDataChange
}) => {
  const [passengerData, setPassengerData] = React.useState({})

  const handlePassengerDataChange = (index, data) => {
    setPassengerData(prev => ({
      ...prev,
      [index]: data
    }))
    if (onPassengerDataChange) {
      onPassengerDataChange({ ...passengerData, [index]: data })
    }
  }

  const totalPassengers = passengers.adult + passengers.child + passengers.infant
  
  if (totalPassengers === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Passenger Details</h3>
        <div className="text-sm text-muted-foreground">
          Total Passengers: <span className="font-bold">{totalPassengers}</span>
        </div>
      </div>
      
      {/* Table Header for Reference */}
      <div className="hidden md:grid grid-cols-8 gap-3 px-4 py-2 bg-muted/30 rounded-t-lg text-sm font-medium">
        <div className="col-span-1">Passenger</div>
        <div className="col-span-1">Title</div>
        <div className="col-span-1">Surname</div>
        <div className="col-span-1">Given Name</div>
        <div className="col-span-1">Passport No</div>
        <div className="col-span-1">Date of Birth</div>
        <div className="col-span-1">Passport Expiry</div>
        <div className="col-span-1">Nationality</div>
      </div>
      
      {/* Passenger Rows */}
      <div className="space-y-3">
        {/* Adult Passengers */}
        {Array.from({ length: passengers.adult }).map((_, index) => (
          <PassengerRow
            key={`adult-${index}`}
            index={index}
            type="Adult"
            onDataChange={handlePassengerDataChange}
          />
        ))}
        
        {/* Child Passengers */}
        {Array.from({ length: passengers.child }).map((_, index) => (
          <PassengerRow
            key={`child-${passengers.adult + index}`}
            index={passengers.adult + index}
            type="Child"
            onDataChange={handlePassengerDataChange}
          />
        ))}
        
        {/* Infant Passengers */}
        {Array.from({ length: passengers.infant }).map((_, index) => (
          <PassengerRow
            key={`infant-${passengers.adult + passengers.child + index}`}
            index={passengers.adult + passengers.child + index}
            type="Infant"
            onDataChange={handlePassengerDataChange}
          />
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground pt-2">
        All fields are required for ticket issuance
      </div>
    </div>
  )
}