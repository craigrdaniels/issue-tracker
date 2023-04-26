import { ReactElement } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LoginPage = (): ReactElement => {
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
      const password = formData.get('password') as string

      // await auth.signIn(email, password)
      await auth.logIn(email, password, () => {
        navigate(from, { replace: true })
      })
    } catch (e) {
      console.log(e)
      setError('Failed to log on')
    }

    setLoading(false)
  }

  return (
    <div className="flex h-screen flex-col items-center gap-4 pt-16 align-middle text-neutral-800 dark:text-neutral-50">
      <h3 className="text-lg font-bold">Login</h3>
      {error && (
        <div className="rounded-full bg-red-200 px-4 text-red-900">{error}</div>
      )}
      <form
        className="flex flex-col items-center gap-4 align-middle"
        onSubmit={handleSubmit}
      >
        <input
          className="rounded-full border bg-neutral-100 px-4 py-1 text-neutral-800 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-50  dark:focus:border-blue-500 dark:focus:ring-blue-500"
          name="email"
          type="text"
          placeholder="Email"
        />
        <input
          className="rounded-full border bg-neutral-100 px-4 py-1 text-neutral-800 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-50  dark:focus:border-blue-500 dark:focus:ring-blue-500"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Link style={{ textDecoration: 'underline' }} to="/resetpassword">
          Forgot password?
        </Link>
        <button
          className="rounded-full border bg-neutral-100 px-4 py-1 text-neutral-800 outline-none hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-50  dark:focus:border-blue-500 dark:focus:ring-blue-500"
          disabled={loading}
          type="submit"
        >
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
  )
}

export default LoginPage
