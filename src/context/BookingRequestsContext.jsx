import * as React from 'react'

const BookingRequestsContext = React.createContext(null)

export function BookingRequestsProvider({ children }) {
  const [requests, setRequests] = React.useState(() => {
    try {
      const saved = localStorage.getItem('booking-requests')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  React.useEffect(() => {
    localStorage.setItem('booking-requests', JSON.stringify(requests))
  }, [requests])

  const addBooking = React.useCallback((booking) => {
    const entry = {
      id: booking.id || `BR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      reference: booking.reference,
      ticketId: booking.ticketId,
      bookingDate: booking.bookingDate || new Date().toISOString(),
      flightInfo: booking.flightInfo || '—',
      passengerCount: booking.passengerCount ?? 0,
      totalAmount: booking.totalAmount ?? 0,
      status: 'pending',
      passengers: booking.passengers || [],
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [entry, ...prev])
    return entry.id
  }, [])

  const updateStatus = React.useCallback((id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }, [])

  const value = React.useMemo(
    () => ({ requests, addBooking, updateStatus }),
    [requests, addBooking, updateStatus]
  )

  return (
    <BookingRequestsContext.Provider value={value}>
      {children}
    </BookingRequestsContext.Provider>
  )
}

export function useBookingRequests() {
  const ctx = React.useContext(BookingRequestsContext)
  if (!ctx) throw new Error('useBookingRequests must be used within BookingRequestsProvider')
  return ctx
}
