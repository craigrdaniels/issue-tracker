import { ReactElement } from 'react'
import { Navigate, isRouteErrorResponse, useRouteError } from 'react-router-dom'

const ErrorPage = (): ReactElement => {
  const error = useRouteError()
  //console.log(error)

  if (error.status === 401) {
    return <Navigate to="/login" replace={true} />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl">Oops!</h1>
      <p>Sorry, an unexpected error occured</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

export default ErrorPage
