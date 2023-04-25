import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
  let auth = { token: false }

  if (!auth.token) {
    console.log('Not authorized!')
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default ProtectedRoute
