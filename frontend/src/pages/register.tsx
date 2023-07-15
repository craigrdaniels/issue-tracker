import { ReactElement, ChangeEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'
import HTTPRequestError from '../utils/HTTPError'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Input } from '../components/Input'
import { isValidEmail, isStrongPassword } from '../utils/InputVerification'
import useFormValues from '../hooks/useFormValues'

const RegisterPage = (): ReactElement => {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [values, setValue] = useFormValues()
  const [inputErrors, setInputError, clearInputError] = useFormValues()
  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  useEffect(() => {
    if (
      Object.keys(inputErrors).length === 0 &&
      Object.keys(values).length > 0
    ) {
      setCanSubmit(true)
    } else {
      setCanSubmit(false)
    }
  }, [inputErrors, values])

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError('')

      await auth.register(
        values.email as string,
        values.username as string,
        values.password as string,
        () => {
          navigate(from, { replace: true })
        }
      )
    } catch (e) {
      if (e instanceof HTTPRequestError) {
        setError(`Registration Failed: ${e.message}`)
      } else {
        setError('Registration Failed - Unknown Error')
        console.log(e)
      }
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('email', e.target.value)
    setValue('username', e.target.value.match(/^[^@]*/)[0])

    if (e.target.value.length > 0 && !isValidEmail(e.target.value)) {
      setInputError('email', 'Invalid Email')
    } else {
      clearInputError('email')
    }
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('username', e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('password', e.target.value)
    if (e.target.value.length > 0 && !isStrongPassword(e.target.value)) {
      setInputError('password', 'Invalid password')
    } else {
      clearInputError('password')
    }
  }

  const handleVerifyPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('verifyPass', e.target.value)

    if (e.target.value !== values.password) {
      setInputError('verifyPass', 'Passwords must match')
    } else {
      clearInputError('verifyPass')
    }
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
          <Input
            id="email"
            type="text"
            placeholder="Email"
            required={true}
            onChange={handleEmailChange}
            error={inputErrors.email}
          />
          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={values.username}
            onChange={handleUsernameChange}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            required={true}
            error={inputErrors.password}
          />
          <Input
            id="verifyPass"
            type="password"
            placeholder="Verify Password"
            onChange={handleVerifyPasswordChange}
            required={true}
            error={inputErrors.verifyPass}
          />
          <button
            className={clsx('btn', canSubmit ? 'btn-primary' : 'btn-disabled')}
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
