import React from 'react'
import {
  IconReceipt,
  IconPlaneDeparture,
  IconPlaneArrival,
  IconCalendar,
  IconClock,
  IconShoppingBag,
  IconMeat,
  IconBriefcase,
  IconUser
} from '@tabler/icons-react'
import { Input } from './Input'
import { Label } from './Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import { Checkbox } from './Checkbox'
import { Button } from './Button'

const FlightDetailsTab = ({ formData, handleChange, airlines, bookingClasses, showPassengerTab, setShowPassengerTab }) => {
  const calculateDuration = () => {
    if (!formData.departureTime || !formData.arrivalTime) return null

    const [depHours, depMinutes] = formData.departureTime.split(':').map(Number)
    const [arrHours, arrMinutes] = formData.arrivalTime.split(':').map(Number)

    let durationHours = arrHours - depHours
    let durationMinutes = arrMinutes - depMinutes

    if (durationMinutes < 0) {
      durationHours--
      durationMinutes += 60
    }

    if (durationHours < 0) {
      durationHours += 24
    }

    return `${durationHours}h ${durationMinutes}m`
  }

  const flightDuration = calculateDuration()

  return (
    <>
      {/* PNR and Flight Number */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Input
            label="PNR Number"
            required
            placeholder="ABC123"
            value={formData.pnr}
            onChange={(e) => handleChange('pnr', e.target.value.toUpperCase())}
            leftIcon={<IconReceipt className="h-4 w-4" />}
            maxLength={6}
            helperText="6-character booking reference"
            error={formData.pnr && formData.pnr.length < 6 ? "PNR must be 6 characters" : ""}
          />
        </div>
        <div className="space-y-3">
          <Input
            label="Flight Number"
            required
            placeholder="9P740"
            value={formData.flight}
            onChange={(e) => handleChange('flight', e.target.value.toUpperCase())}
            helperText="Airline code + flight number"
          />
        </div>
      </div>

      {/* Flight Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Origin (IATA)"
            required
            placeholder="ISB"
            value={formData.origin}
            onChange={(e) => handleChange('origin', e.target.value.toUpperCase())}
            leftIcon={<IconPlaneDeparture className="h-4 w-4" />}
            maxLength={3}
            error={formData.origin && formData.origin.length !== 3 ? "Must be 3 letters" : ""}
            success={formData.origin.length === 3 ? "Valid airport code" : ""}
          />
          <Input
            label="Destination (IATA)"
            required
            placeholder="SHJ"
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value.toUpperCase())}
            leftIcon={<IconPlaneArrival className="h-4 w-4" />}
            maxLength={3}
            error={formData.destination && formData.destination.length !== 3 ? "Must be 3 letters" : ""}
            success={formData.destination.length === 3 ? "Valid airport code" : ""}
          />
        </div>
      </div>

      {/* Date & Airline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            leftIcon={<IconCalendar className="h-4 w-4" />}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="airline">Airline *</Label>
          <Select
            value={formData.airline}
            onValueChange={(value) => handleChange('airline', value)}
          >
            <SelectTrigger id="airline" className="w-full">
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent>
              {airlines.map((airline) => (
                <SelectItem key={airline.value} value={airline.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${airline.color}`} />
                    {airline.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label htmlFor="bookingClass">Booking Class</Label>
          <Select
            value={formData.bookingClass}
            onValueChange={(value) => handleChange('bookingClass', value)}
          >
            <SelectTrigger id="bookingClass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bookingClasses.map((cls) => (
                <SelectItem key={cls.value} value={cls.value}>
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4" />
                    {cls.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Departure Time"
            type="time"
            required
            value={formData.departureTime}
            onChange={(e) => handleChange('departureTime', e.target.value)}
            leftIcon={<IconClock className="h-4 w-4" />}
          />
          <Input
            label="Arrival Time"
            type="time"
            required
            value={formData.arrivalTime}
            onChange={(e) => handleChange('arrivalTime', e.target.value)}
            leftIcon={<IconClock className="h-4 w-4" />}
          />
        </div>
        {flightDuration && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
            <IconClock className="h-3.5 w-3.5" />
            Flight duration: <span className="font-semibold">{flightDuration}</span>
          </div>
        )}
      </div>

      {/* Baggage & Meal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Baggage Allowance"
          placeholder="20+7 KG"
          value={formData.bag}
          onChange={(e) => handleChange('bag', e.target.value)}
          leftIcon={<IconShoppingBag className="h-4 w-4" />}
          helperText="e.g., 20+7 KG"
        />
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <IconMeat className="h-4 w-4" />
            Meal Options
          </Label>
          <div className="flex items-center space-x-3 p-3 border rounded-md">
            <Checkbox
              id="meal"
              checked={formData.meal}
              onCheckedChange={(checked) => handleChange('meal', checked)}
            />
            <Label htmlFor="meal" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              Meal included
            </Label>
          </div>
        </div>
      </div>

      {/* Additional Flight Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Seat Number"
          placeholder="12A"
          value={formData.seatNumber}
          onChange={(e) => handleChange('seatNumber', e.target.value.toUpperCase())}
          helperText="Optional seat assignment"
        />
        <Input
          label="Ticket Number"
          placeholder="1234567890"
          value={formData.ticketNumber}
          onChange={(e) => handleChange('ticketNumber', e.target.value)}
          helperText="13-digit ticket number"
        />
      </div>

      {/* Add Passenger Info Option */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Add Passenger Information</h4>
            <p className="text-sm text-muted-foreground">
              Optional: Include passenger details now or let agents add them later
            </p>
          </div>
          <Button
            type="button"
            variant={showPassengerTab ? "default" : "outline"}
            onClick={() => setShowPassengerTab(!showPassengerTab)}
            className="gap-2"
          >
            <IconUser className="h-4 w-4" />
            {showPassengerTab ? 'Hide Passenger Info' : 'Add Passenger Info'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default FlightDetailsTab