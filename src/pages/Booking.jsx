// pages/Booking.jsx
import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent } from "../components/ui/Card"
import { FlightDetailsCard } from "../components/ui/FlightDetailsCard"
import { PassengerCounter } from "../components/ui/PassengerCounter"
import { PassengersTable } from "../components/ui/PassengersTable"
import { BookingSummary } from "../components/ui/BookingSummary"
import { Separator } from "../components/ui/Separator"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Loader2, Shield, Lock, Users, FileText, AlertCircle } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { PassengerRow, usePassengerRows } from "../components/ui/PassenderRow"

export default function Booking() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("passengers")
  const [passengers, setPassengers] = React.useState({
    adult: 1,
    child: 0,
    infant: 0
  })
  const [passengerData, setPassengerData] = React.useState([])
  const [bookingData, setBookingData] = React.useState(null)
  const [showValidation, setShowValidation] = React.useState(false)
  
  const {
    passengers: passengerRows,
    updatePassenger,
    isAllValid,
    getValidationErrors
  } = usePassengerRows([])

  // Generate passenger rows when counts change
  React.useEffect(() => {
    const totalRows = passengers.adult + passengers.child + passengers.infant
    const currentRows = passengerRows.length
    
    if (totalRows > currentRows) {
      // Add new rows
      const rowsToAdd = totalRows - currentRows
      const newRows = []
      
      for (let i = 0; i < rowsToAdd; i++) {
        const type = 
          i < passengers.adult ? "Adult" :
          i < passengers.adult + passengers.child ? "Child" : "Infant"
        newRows.push({
          id: Date.now() + i,
          type,
          title: type === "Adult" ? "Mr" : type === "Child" ? "Master" : "INF"
        })
      }
      
      // Update passenger rows
    } else if (totalRows < currentRows) {
      // Remove extra rows (keep the logic simple for now)
    }
  }, [passengers])

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
      // Prepare booking payload
      const bookingPayload = {
        ticketId,
        passengers: passengerRows,
        totalAmount: passengers.adult * (bookingData?.adultPrice || 0),
        bookingDate: new Date().toISOString()
      }

      console.log("Booking payload:", bookingPayload)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success("Booking confirmed successfully!", {
        description: `Booking reference: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        duration: 5000,
        icon: <FileText className="h-4 w-4" />
      })

      // Navigate to payment or confirmation page
      navigate(`/booking/${ticketId}/confirmation`)
    } catch (error) {
      console.error("Error confirming booking:", error)
      toast.error("Failed to confirm booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total passengers for display
  const totalPassengers = passengers.adult + passengers.child + passengers.infant

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 dark:text-blue-400 mt-0.5">
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
                              key={index}
                              index={index}
                              type={type}
                              onDataChange={handlePassengerDataChange}
                              onValidation={() => {}}
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
              {/* Review content will go here */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="space-y-6">
          <BookingSummary
            adultCount={passengers.adult}
            adultPrice={bookingData?.adultPrice || 94000}
            childCount={passengers.child}
            childPrice={bookingData?.childPrice || 0}
            infantCount={passengers.infant}
            onConfirmBooking={handleConfirmBooking}
            isLoading={isLoading}
            isValid={isAllValid()}
          />

          {/* Additional Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Need Help?
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Customer Support</div>
                  <div className="text-muted-foreground">+92 300 123 4567</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Email Support</div>
                  <div className="text-muted-foreground">support@flyjinnah.com</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Office Hours</div>
                  <div className="text-muted-foreground">9:00 AM - 11:00 PM (PKT)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copyright Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <div>Copyright © {new Date().getFullYear()} FlyJinnah. All Rights Reserved.</div>
            <div className="mt-1">
              <a href="#" className="hover:underline">Terms & Conditions</a> • 
              <a href="#" className="hover:underline mx-2">Privacy Policy</a> • 
              <a href="#" className="hover:underline">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}