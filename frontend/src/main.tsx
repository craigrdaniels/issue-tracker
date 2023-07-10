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
import { Issues } from './pages/issues-list'
import Issue from './pages/issue'
import {
  issueLoader,
  issueAction,
  issuesLoader,
  projectLoader,
  projectsLoader,
  newIssueAction,
  newIssueLoader,
  newProjectAction,
} from './utils/Loaders'
import { Projects } from './pages/projects-list'
import { Project } from './pages/project'
import { NewIssue } from './pages/new-issue'
import { NewProject } from './pages/new-project'
import { AlertProvider } from './hooks/useAlert'
import WelcomePage from './pages/welcome'

const router = createBrowserRouter([
  {
    element: <SharedRootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <WelcomePage />,
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
        element: <ProtectedRoute />,
        children: [
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'issues',
            element: <Issues />,
            loader: issuesLoader,
          },
          {
            path: 'issues/:id',
            element: <Issue />,
            id: 'issue',
            loader: issueLoader,
            action: issueAction,
          },
          {
            path: 'projects',
            element: <Projects />,
            loader: projectsLoader,
          },
          {
            path: 'projects/new',
            element: <NewProject />,
            action: newProjectAction,
          },
          {
            path: 'projects/:id',
            element: <Project />,
            loader: projectLoader,
          },
          {
            path: 'projects/:id/new',
            element: <NewIssue />,
            loader: newIssueLoader,
            action: newIssueAction,
          },
          {
            path: 'projects/:id/issues',
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
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
)
