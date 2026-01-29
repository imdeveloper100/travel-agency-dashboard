import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'

const PreviewCard = ({ formData }) => {
  const isFormValid = formData.pnr && formData.flight && formData.origin && formData.destination &&
    formData.departureTime && formData.arrivalTime &&
    formData.price && formData.airline

  return (
    <Card className="lg:w-96">
      <CardHeader>
        <CardTitle className="text-lg">Ticket Preview</CardTitle>
        <CardDescription>
          A quick look at your flight details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Route</span>
            <span className="font-medium">
              {formData.origin && formData.destination
                ? `${formData.origin} → ${formData.destination}`
                : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Flight</span>
            <span className="font-medium">{formData.flight || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">
              {formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              }) : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">PNR</span>
            <span className="font-medium">{formData.pnr || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Airline</span>
            <span className="font-medium">{formData.airline || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Price</span>
            <span className="font-medium text-lg">
              {formData.price ? `PKR ${parseInt(formData.price).toLocaleString()}` : 'PKR 0'}
            </span>
          </div>
        </div>

        {formData.passengerName && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Passenger Info (Optional)</div>
            <div className="mt-1 text-sm">
              {formData.passengerName}
              {formData.email && ` • ${formData.email}`}
            </div>
          </div>
        )}

        {isFormValid && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Ticket Summary</div>
              <div className="text-lg font-semibold">{formData.pnr}</div>
              <div className="text-sm">
                {formData.flight} • {formData.origin} → {formData.destination}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {formData.passengerName || 'No passenger info'} • {formData.bookingClass}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PreviewCard