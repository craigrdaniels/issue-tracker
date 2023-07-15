import { Suspense, ReactElement, useState, useEffect } from 'react'
import clsx from 'clsx'
import { Await, Form, useLoaderData } from 'react-router-dom'
import { ActionDataResponse, User } from '../utils/Types'
import { Input } from '../components/Input'
import useFormErrorHandler from '../hooks/useFormErrors'

const UserPage = (): ReactElement => {
  const { user } = useLoaderData() as ActionDataResponse
  const [editing, setEditing] = useState<boolean>(false)
  const [error, setError, clearError] = useFormErrorHandler()

  useEffect(() => {
    if (Object.keys(error).length === 0) {
      setEditing(true)
    } else {
      setEditing(false)
    }
  }, [error])

  const renderLoadingElements = () => {
    return <h2>Loading..</h2>
  }

  const checkEmailValidity = (e) => {
    if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]{2,}$/i.test(
        e.target.value
      ) === true
    ) {
      clearError('email')
    } else {
      setError('email', 'Invalid Email')
    }
  }

  const checkPasswordStrength = (e) => {
    if (
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
        e.target.value
      ) === true ||
      e.target.value.length === 0
    ) {
      clearError('passwordStrength')
    } else {
      setError('passwordStrength', 'Invalid password')
    }
  }

  const checkNewPasswordMatch = () => {
    if (
      document.getElementById('newpassword').value ===
      document.getElementById('verifypassword').value
    ) {
      clearError('verifyPassword')
    } else {
      setError('verifyPassword', 'Passwords must match')
    }
  }

  const renderPage = (user: User) => {
    return (
      <div className="card mx-auto mt-20 w-96 justify-center place-self-center self-center bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">User Details</h2>
          <Form className="flex flex-col items-center gap-4 align-middle">
            <Input
              label="Email"
              type="text"
              id="email"
              placeholder={user.email}
              defaultValue={user.email}
              onChange={(e) => checkEmailValidity(e)}
              error={error.email}
            />
            <Input
              label="Username"
              type="text"
              id="username"
              placeholder={user.username}
              defaultValue={user.username}
            />
            <Input
              label="Password"
              placeholder="********"
              type="password"
              id="password"
            />
            <Input
              label="New Password"
              type="password"
              id="newpassword"
              onChange={(e) => {
                checkPasswordStrength(e)
                checkNewPasswordMatch()
              }}
              error={error.passwordStrength}
            />
            <Input
              label="Verify New Password"
              type="password"
              id="verifypassword"
              onChange={checkNewPasswordMatch}
              error={error.verifyPassword}
            />
            <button
              className={clsx('btn', editing ? 'btn-primary' : 'btn-disabled')}
              type="submit"
            >
              Update
            </button>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={renderLoadingElements()}>
        <Await resolve={user as User}>{renderPage}</Await>
      </Suspense>
    </>
  )
}

export default UserPage
