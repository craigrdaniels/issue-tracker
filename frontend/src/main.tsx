import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ErrorPage from './pages/error-page'
import './index.css'
import SharedRootLayout from './routes/SharedRootLayout'
import Home from './pages/home'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProtectedRoute from './routes/ProtectedRoute'
import Issues from './pages/issues'
import Issue from './pages/issue'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedRootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/*',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'issues',
            element: <Issues />,
          },
          {
            path: 'issues/:id',
            element: <Issue />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
