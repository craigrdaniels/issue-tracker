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
import Issue, { issueLoader, action as messageAction } from './pages/issue'
import { Projects, projectsLoader } from './pages/projects-list'
import { Project, projectLoader } from './pages/project'
import {
  newIssueLoader,
  NewIssue,
  action as newIssueAction,
} from './pages/new-issue'
import { NewProject, action as newProjectAction } from './pages/new-project'
import { AlertProvider } from './hooks/useAlert'

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
            action: messageAction,
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
