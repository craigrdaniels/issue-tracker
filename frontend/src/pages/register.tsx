import { ReactElement } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HTTPRequestError from '../utils/HTTPError'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const RegisterPage = (): ReactElement => {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError('')
      setLoading(true)
      const formData = new FormData(event.currentTarget)
      const email = formData.get('email') as string
      const username = formData.get('username') as string
      const password = formData.get('password') as string

      await auth.register(email, username, password, () => {
        navigate(from, { replace: true })
      })
    } catch (e) {
      if (e instanceof HTTPRequestError) {
        setError(`Registration Failed: ${e.message}`)
      } else {
        setError('Registration Failed - Unknown Error')
        console.log(e)
      }
    }
    setLoading(false)
  }

  return (
    <div className="card mx-auto mt-20 w-96 place-self-center self-center justify-self-center bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Register</h2>
        {error && (
          <div className="alert alert-error shadow-lg">
            <ExclamationTriangleIcon className="h-6 w-6" />
            {error}
          </div>
        )}
        <form
          className="flex flex-col items-center gap-4 align-middle"
          onSubmit={handleSubmit}
        >
          <input
            className="input-bordered input w-full max-w-xs"
            name="email"
            type="text"
            placeholder="Email"
          />
          <input
            className="input-bordered input w-full max-w-xs"
            name="username"
            type="text"
            placeholder="Username"
          />
          <input
            className="input-bordered input w-full max-w-xs"
            name="password"
            type="password"
            placeholder="Password"
          />
          <button disabled={loading} className="btn-primary btn" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
