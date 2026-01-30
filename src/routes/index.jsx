import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import CreateTicket from '../pages/CreateTicket'
import Tickets from '../pages/Tickets'
import Login from '../pages/Login'
import Booking from '../pages/Booking'
import Confirmation from '../pages/Confirmation'
import BookingRequest from '../pages/BookingRequest'

/**
 * Centralized Route Configuration
 * 
 * All routes are nested under a Layout route that provides Sidebar + Header.
 * Pages are rendered in the Layout's <Outlet /> component.
 * 
 * To add a new route:
 * 1. Import your page component
 * 2. Add a new object to the children array inside the Layout route
 * 
 * For routes that need authentication, wrap the Layout with <ProtectedRoute>
 * For public routes (like login), add them outside the Layout route
 */
export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // This makes it the default route for '/'
        element: <Tickets />,
      },
      {
        path: 'tickets',
        element: <Tickets />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'create-ticket',
        element: <CreateTicket />,
      },
      {
        path: 'booking/:ticketId',
        element: <Booking />,
      },
      {
        path: 'booking/:ticketId/confirmation',
        element: <Confirmation />,
      },
      {
        path: 'booking-requests',
        element: <BookingRequest />,
      },
      // Add more routes here as needed
      // Example:
      // {
      //   path: 'settings',
      //   element: <Settings />,
      // },
    ],
  },
  // Public routes (without Layout) can be added here
  // Example:
  // {
  //   path: '/login',
  //   element: <Login />,
  // },
]

// Create and export the router
export const router = createBrowserRouter(routes)
