import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { BookingRequestsProvider } from './context/BookingRequestsContext'

function App() {
  return (
    <BookingRequestsProvider>
      <RouterProvider router={router} />
    </BookingRequestsProvider>
  )
}

export default App