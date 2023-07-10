import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = () => {
  const auth = useAuth()

  if (!auth.user) {
    console.log('Not authorized!')
    auth.logOut(() => {})
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
