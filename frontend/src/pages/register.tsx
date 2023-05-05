import { ReactElement } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
      console.log(e)
      setError('Registration Failed')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-16 align-middle">
      <h3>Register</h3>
      {error && (
        <div className="rounded-full bg-red-200 px-4 text-red-900">{error}</div>
      )}
      <form
        className="flex flex-col items-center gap-4 align-middle"
        onSubmit={handleSubmit}
      >
        <input
          className="text-input"
          name="email"
          type="text"
          placeholder="Email"
        />
        <input
          className="text-input"
          name="username"
          type="text"
          placeholder="Username"
        />
        <input
          className="text-input"
          name="password"
          type="password"
          placeholder="Password"
        />
        <button disabled={loading} type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
