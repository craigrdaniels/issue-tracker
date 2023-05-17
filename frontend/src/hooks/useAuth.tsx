import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react'
import useLocalStorage from './useLocalStorage'
import HTTPRequestError from '../utils/HTTPError'

interface AuthContextType {
  user: any
  logIn: (
    email: string,
    password: string,
    callback: VoidFunction
  ) => Promise<void>
  register: (
    email: string,
    username: string,
    password: string,
    callback: VoidFunction
  ) => Promise<void>
  logOut: (callback: VoidFunction) => void
}

const location = import.meta.env.SERVER
  ? process.env.SERVER?.split(':')[0]
  : window.location.hostname

const port = import.meta.env.SERVER?.split(':')[1]
  ? process.env.SERVER?.split(':')
  : '3000'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useLocalStorage('user', null)

  const logIn = async (
    email: string,
    password: string,
    callback: VoidFunction
  ): Promise<void> => {
    const settings: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    }

    console.log('Logging on..')

    const response = await fetch(`http://${location}:${port}/login`, settings)
    const data = await response.json()
    console.log(data.user)
    setUser(data.user)

    // navigate('/issues')
    callback()
  }

  const register = async (
    email: string,
    username: string,
    password: string,
    callback: VoidFunction
  ): Promise<void> => {
    const settings: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    }

    console.log('Registering user..')

    const response = await fetch(
      `http://${location}:${port}/users/signup`,
      settings
    )
    const data = await response.json()

    if (response.status !== 201)
      throw new HTTPRequestError(response.status, data.message)

    logIn(email, password, callback)

    callback()
  }

  const logOut = async (callback: VoidFunction) => {
    const settings: RequestInit = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
    await fetch(`http://${location}:${port}/logout`, settings)
    setUser(null)
    callback()
  }

  const values = useMemo(
    () => ({
      user,
      logIn,
      logOut,
      register,
    }),
    [user]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
