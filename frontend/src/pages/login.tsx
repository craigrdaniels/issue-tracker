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
    <div className="flex h-screen flex-col items-center gap-4 pt-16 align-middle text-neutral-800">
      <h3 className="text-lg font-bold">Login</h3>
      {error && (
        <div className="rounded-full bg-red-200 px-4 text-red-900">{error}</div>
      )}
      <form
        className="flex flex-col items-center gap-4 align-middle"
        onSubmit={handleSubmit}
      >
        <input name="email" type="text" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <Link style={{ textDecoration: 'underline' }} to="/resetpassword">
          Forgot password?
        </Link>
        <button disabled={loading} type="submit">
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
