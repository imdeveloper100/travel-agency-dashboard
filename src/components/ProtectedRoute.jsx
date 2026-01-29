import { Navigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Currently allows all access (ready for future authentication implementation).
 * 
 * To enable authentication:
 * 1. Implement useAuth hook with authentication logic
 * 2. Uncomment the authentication check below
 */
export default function ProtectedRoute({ children }) {
  // const { isAuthenticated, isLoading } = useAuth()
  
  // TODO: Uncomment when implementing authentication
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />
  // }
  
  // For now, allow all access
  return children
}
