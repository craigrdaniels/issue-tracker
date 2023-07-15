import { ReactElement, ChangeEvent } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Input } from '../components/Input'
import useFormValues from '../hooks/useFormValues'

const LoginPage = (): ReactElement => {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [values, setValue] = useFormValues()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError('')
      await auth.logIn(
        values.email as string,
        values.password as string,
        () => {
          navigate(from, { replace: true })
        }
      )
    } catch (e) {
      setError('Incorrect username/password')
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('email', e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('password', e.target.value)
  }

  return (
    <div className="card mx-auto mt-20 w-96 place-self-center self-center justify-self-center bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
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
          <Input
            name="email"
            id="email"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleEmailChange(e)
            }
            placeholder="Email"
            required={true}
          />
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePasswordChange(e)
            }
            required={true}
          />
          <Link style={{ textDecoration: 'underline' }} to="/resetpassword">
            Forgot password?
          </Link>
          <button className="btn-primary btn" type="submit">
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account?{' '}
          <Link style={{ textDecoration: 'underline' }} to="/register">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
