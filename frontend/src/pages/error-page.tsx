import { ReactElement } from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage = (): ReactElement => {
  const error = useRouteError()
  console.log(error)

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl">Oops!</h1>
      <p>Sorry, an unexpected error occured</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

export default ErrorPage
