import { ReactElement, useEffect } from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ErrorPage = (): ReactElement => {
  const auth = useAuth()
  const navigate = useNavigate()
  const error = useRouteError()

  useEffect(() => {
    if ((error as { status?: number })?.status === 401) {
      auth.logOut(() => {
        navigate('/login', { replace: true })
      })
    }
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl">Oops!</h1>
      <p>Sorry, an unexpected error occured</p>
      <p>
        <i>
          {(error as { statusText?: string })?.statusText ||
            (error as Error)?.message}
        </i>
      </p>
    </div>
  )
}

export default ErrorPage
