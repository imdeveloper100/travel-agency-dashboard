import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function Confirmation() {
  const { ticketId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary">
            <CheckCircle className="h-8 w-8" />
            Booking Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your ticket booking (ID: {ticketId}) has been confirmed successfully.
          </p>
          <Button onClick={() => navigate('/tickets')}>
            Back to Tickets
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
