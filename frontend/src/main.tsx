import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ErrorPage from './pages/error-page'
import './index.css'
import Home from './pages/home'
import LoginPage from './pages/login'
import ProtectedRoute from './routes/ProtectedRoute'
import Issues from './pages/issues'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/*',
    element: <ProtectedRoute />,
    children: [{ path: 'issues', element: <Issues /> }],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
