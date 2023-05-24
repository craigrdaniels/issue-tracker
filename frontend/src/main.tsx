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
import { Issues, issuesLoader } from './pages/issues-list'
import Issue, { issueLoader } from './pages/issue'
import { Projects, projectsLoader } from './pages/projects-list'

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
            loader: issuesLoader,
          },
          {
            path: 'issues/:id',
            element: <Issue />,
            loader: issueLoader,
          },
          {
            path: 'projects',
            element: <Projects />,
            loader: projectsLoader,
          },
          {
            path: 'projects/:id/*',
            element: <Issues />,
            loader: issuesLoader,
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
