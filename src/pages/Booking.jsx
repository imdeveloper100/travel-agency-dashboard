// pages/Booking.jsx
import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent } from "../components/ui/Card"
import { FlightDetailsCard } from "../components/ui/FlightDetailsCard"
import { PassengerCounter } from "../components/ui/PassengerCounter"
import { PassengersTable } from "../components/ui/PassengersTable"
import { BookingSummary } from "../components/ui/BookingSummary"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Loader2, Shield, Lock, Users, FileText, AlertCircle } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { PassengerRow, usePassengerRows } from "../components/ui/PassenderRow"
import { useBookingRequests } from "../context/BookingRequestsContext"

export default function Booking() {
  const { addBooking } = useBookingRequests()
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("passengers")
  const [passengers, setPassengers] = React.useState({
    adult: 1,
    child: 0,
    infant: 0
  })
  const [bookingData] = React.useState(null)
  const [showValidation, setShowValidation] = React.useState(false)

  const {
    passengers: passengerRows,
    updatePassenger,
    ensurePassengerCount,
    isAllValid,
    getValidationErrors
  } = usePassengerRows([])

  const totalPassengers = passengers.adult + passengers.child + passengers.infant

  // Keep passenger rows in sync with passenger count
  React.useEffect(() => {
    if (totalPassengers <= 0) return
    const getType = (i) =>
      i < passengers.adult ? "Adult" :
        i < passengers.adult + passengers.child ? "Child" : "Infant"
    ensurePassengerCount(totalPassengers, getType)
  }, [totalPassengers, passengers.adult, passengers.child, passengers.infant])

  const handlePassengerChange = (type, count) => {
    setPassengers(prev => ({
      ...prev,
      [type.toLowerCase()]: count
    }))
  }

  const handlePassengerDataChange = (index, data) => {
    updatePassenger(index, data)
  }

  const handleConfirmBooking = async () => {
    setShowValidation(true)

    if (!isAllValid()) {
      const errors = getValidationErrors()
      toast.error("Please complete all passenger details", {
        description: errors.slice(0, 3).join(", ") + (errors.length > 3 ? "..." : ""),
        icon: <AlertCircle className="h-4 w-4" />
      })
      return
    }

    setIsLoading(true)

    try {
      const reference = Math.random().toString(36).substr(2, 8).toUpperCase()
      const totalAmount = passengers.adult * (bookingData?.adultPrice || 94000)
      const bookingDate = new Date().toISOString()

      addBooking({
        reference,
        ticketId,
        bookingDate,
        flightInfo: bookingData?.route || `Flight ${ticketId} • ISB → BAH`,
        passengerCount: totalPassengers,
        totalAmount,
        passengers: passengerRows,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success("Booking confirmed successfully!", {
        description: `Booking reference: ${reference}`,
        duration: 5000,
        icon: <FileText className="h-4 w-4" />
      })

      navigate(`/booking/${ticketId}/confirmation`)
    } catch (error) {
      console.error("Error confirming booking:", error)
      toast.error("Failed to confirm booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Your Booking</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono font-bold bg-muted px-2 py-1 rounded">{ticketId}</span>
              <span>•</span>
              <span>Flight 9P 764 • ISB → BAH</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Secure
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            SSL Encrypted
          </Badge>
          <Badge className="gap-1 bg-primary">
            <Users className="h-3 w-3" />
            {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Flight Details & Passenger Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="passengers" className="gap-2">
                <Users className="h-4 w-4" />
                Passengers
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2" disabled={!isAllValid()}>
                <FileText className="h-4 w-4" />
                Review & Pay
              </TabsTrigger>
            </TabsList>

            <TabsContent value="passengers" className="space-y-6">
              {/* Flight Details Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Flight Summary</h2>
                    <Badge variant="outline">9P 764 • 05 Feb</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Route</div>
                      <div className="font-semibold">ISB → BAH</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-semibold">18:55 - 21:05</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Baggage</div>
                      <div className="font-semibold">20+7 KG</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passenger Selection */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Select Passengers</h2>
                      <div className="text-sm text-muted-foreground">
                        Max 9 passengers per booking
                      </div>
                    </div>

                    <div className="space-y-4">
                      <PassengerCounter
                        type="Adult"
                        price={`PKR ${(bookingData?.adultPrice || 94000).toLocaleString()}`}
                        count={passengers.adult}
                        onChange={handlePassengerChange}
                        max={9}
                        description="12 years and above"
                      />

                      <PassengerCounter
                        type="Child"
                        price="N/A"
                        count={passengers.child}
                        onChange={handlePassengerChange}
                        max={9 - passengers.adult}
                        description="2-11 years"
                      />

                      <PassengerCounter
                        type="Infant"
                        price="Price On Call"
                        count={passengers.infant}
                        onChange={handlePassengerChange}
                        max={Math.min(2, passengers.adult)}
                        description="Under 2 years"
                      />
                    </div>

                    {/* Help Information */}
                    <div className="p-4 bg-blue-50 dark:bg-accent-light/20 rounded-lg border border-accent-light dark:border-accent-light">
                      <div className="flex items-start gap-3">
                        <div className="text-accent-light dark:text-accent-light mt-0.5">
                          💡
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">Important Information</div>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Infants must be accompanied by at least one adult</li>
                            <li>Maximum 2 infants per adult passenger</li>
                            <li>Passport details are required for international flights</li>
                            <li>All passenger names must match official documents</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passenger Details Form */}
              {totalPassengers > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Passenger Details</h2>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Filled: </span>
                          <span className="font-semibold">
                            {passengerRows.filter(p => p.surname && p.givenName).length}/{totalPassengers}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {Array.from({ length: totalPassengers }).map((_, index) => {
                          const type =
                            index < passengers.adult ? "Adult" :
                              index < passengers.adult + passengers.child ? "Child" : "Infant"

                          return (
                            <PassengerRow
                              key={passengerRows[index]?.id ?? index}
                              index={index}
                              type={type}
                              initialData={passengerRows[index]}
                              onDataChange={handlePassengerDataChange}
                              onValidation={() => { }}
                              showErrors={showValidation}
                            />
                          )
                        })}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => setActiveTab("review")}
                          disabled={!isAllValid()}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Continue to Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="review">
              {/* Booking Passenger Details to be shown in a Table, each passenger will have a row with the following columns: Title, Surname, Given Name, Passport No, Date of Birth, Passport Expiry, Nationality */}
              <BookingSummary
                passengerRows={passengerRows}
                adultCount={passengers.adult}
                adultPrice={bookingData?.adultPrice || 94000}
                childCount={passengers.child}
                childPrice={bookingData?.childPrice || 0}
                infantCount={passengers.infant}
                onConfirmBooking={handleConfirmBooking}
                isLoading={isLoading}
                isValid={isAllValid()}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}