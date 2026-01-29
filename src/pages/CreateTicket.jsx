import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconPlane,
  IconCheck,
  IconX,
  IconLoader2,
  IconInfoCircle,
} from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { toast } from 'sonner'
import { Badge } from '../components/ui/Badge'
import { Separator } from '../components/ui/Separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import FlightDetailsTab from '../components/ui/FlightDetailsTab'
import PaymentInfoTab from '../components/ui/PaymentInfoTab'
import PassengerInfoTab from '../components/ui/PassengerInfoTab'
import PreviewCard from '../components/ui/PreviewCard'
import { useTicketForm } from '../hooks/useTicketForm'

export default function CreateTicket() {
  const navigate = useNavigate()
  const {
    formData,
    handleChange,
    handleSubmit,
    handleReset,
    isSubmitting,
    activeTab,
    setActiveTab,
    isFormValid,
    showPassengerTab,
    setShowPassengerTab
  } = useTicketForm()

  const airlines = [
    { value: 'fly-jinnah', label: 'Fly Jinnah', color: 'bg-blue-500' },
    { value: 'air-sial', label: 'Air Sial', color: 'bg-green-500' },
    { value: 'air-arabia', label: 'Air Arabia', color: 'bg-red-500' },
    { value: 'emirates', label: 'Emirates', color: 'bg-yellow-500' },
    { value: 'qatar', label: 'Qatar Airways', color: 'bg-purple-500' },
    { value: 'etihad', label: 'Etihad Airways', color: 'bg-indigo-500' },
  ]

  const bookingClasses = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium-economy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ]

  const paymentMethods = [
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' }
  ]

  const onSubmit = async (e) => {
    e.preventDefault()
    handleSubmit(navigate, toast)
  }

  const onReset = () => {
    handleReset()
    toast.info('Form reset', {
      description: 'All fields have been cleared.',
    })
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Form Card */}
        <Card className="lg:flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconPlane className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create New Ticket</CardTitle>
                  <CardDescription className="mt-1">
                    Fill in flight details to create a ticket. Passenger info can be added later by agents.
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isFormValid ? "default" : "outline"} className="gap-1">
                {isFormValid ? (
                  <>
                    <IconCheck className="h-3 w-3" />
                    Ready to submit
                  </>
                ) : (
                  <>
                    <IconX className="h-3 w-3" />
                    Incomplete
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="flight">
                  <IconPlane className="h-4 w-4 mr-2" />
                  Flight Details
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <IconInfoCircle className="h-4 w-4 mr-2" />
                  Payment Info
                </TabsTrigger>
              </TabsList>
            </div>

            <form onSubmit={onSubmit}>
              <CardContent>
                <TabsContent value="flight" className="space-y-6">
                  <FlightDetailsTab
                    formData={formData}
                    handleChange={handleChange}
                    airlines={airlines}
                    bookingClasses={bookingClasses}
                    showPassengerTab={showPassengerTab}
                    setShowPassengerTab={setShowPassengerTab}
                  />
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <PaymentInfoTab
                    formData={formData}
                    handleChange={handleChange}
                    paymentMethods={paymentMethods}
                  />
                </TabsContent>

                {showPassengerTab && (
                  <TabsContent value="passenger" className="space-y-6">
                    <PassengerInfoTab
                      formData={formData}
                      handleChange={handleChange}
                    />
                  </TabsContent>
                )}

                <Separator className="my-6" />
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t px-6 py-4">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <IconInfoCircle className="h-3.5 w-3.5" />
                  <span>Fields marked with <span className="text-destructive font-medium">*</span> are required</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="min-w-[100px]"
                  >
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/tickets')}
                    className="min-w-[100px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Ticket'
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Tabs>
        </Card>

        {/* Preview Card */}
        <PreviewCard formData={formData} />
      </div>
    </div>
  )
}