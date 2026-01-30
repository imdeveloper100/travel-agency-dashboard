import * as React from 'react'

export const useTicketForm = () => {
  const [formData, setFormData] = React.useState({
    pnr: '',
    date: '',
    origin: '',
    destination: '',
    flight: '',
    departureTime: '',
    arrivalTime: '',
    bag: '',
    meal: false,
    price: '',
    airline: '',
    bookingClass: 'Economy',
    passengerName: '',
    email: '',
    phone: '',
    seatNumber: '',
    ticketNumber: '',
    paymentMethod: 'credit-card',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('flight')
  const [showPassengerTab, setShowPassengerTab] = React.useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (navigate, toast) => {
    setIsSubmitting(true)

    // Validate required fields (only flight details and price)
    const requiredFields = [
      'pnr', 'date', 'origin', 'destination', 'flight',
      'departureTime', 'arrivalTime', 'price', 'airline'
    ]

    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields', {
        description: `Missing: ${missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`,
      })
      setIsSubmitting(false)
      return
    }

    // Validate airport codes
    if (formData.origin && formData.origin.length !== 3) {
      toast.error('Invalid origin airport code', {
        description: 'Airport code must be 3 letters (e.g., ISB, LHR)',
      })
      setIsSubmitting(false)
      return
    }

    if (formData.destination && formData.destination.length !== 3) {
      toast.error('Invalid destination airport code', {
        description: 'Airport code must be 3 letters (e.g., SHJ, JFK)',
      })
      setIsSubmitting(false)
      return
    }

    // Validate email only if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Invalid email address', {
          description: 'Please enter a valid email address',
        })
        setIsSubmitting(false)
        return
      }
    }

    // Simulate API call with loading
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Form Data:', formData)

      toast.success('Ticket created successfully! 🎫', {
        description: `PNR: ${formData.pnr} | Flight: ${formData.flight}`,
        duration: 5000,
      })

      setTimeout(() => {
        navigate('../')
      }, 1000)
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Failed to create ticket', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      pnr: '',
      date: '',
      origin: '',
      destination: '',
      flight: '',
      departureTime: '',
      arrivalTime: '',
      bag: '',
      meal: false,
      price: '',
      airline: '',
      bookingClass: 'Economy',
      passengerName: '',
      email: '',
      phone: '',
      seatNumber: '',
      ticketNumber: '',
      paymentMethod: 'credit-card',
      notes: ''
    })
    setShowPassengerTab(false)
  }

  // Calculate flight duration
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
      durationHours += 24 // Handle overnight flights
    }

    return `${durationHours}h ${durationMinutes}m`
  }

  const flightDuration = calculateDuration()

  // Only flight details are required for admin to create ticket
  const isFormValid = formData.pnr && formData.flight && formData.origin && formData.destination &&
    formData.departureTime && formData.arrivalTime &&
    formData.price && formData.airline

  return {
    formData,
    handleChange,
    handleSubmit,
    handleReset,
    isSubmitting,
    activeTab,
    setActiveTab,
    isFormValid,
    flightDuration,
    showPassengerTab,
    setShowPassengerTab
  }
}