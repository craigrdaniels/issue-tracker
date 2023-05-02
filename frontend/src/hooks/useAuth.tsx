import { ReactNode, createContext, useContext, useMemo } from 'react'
import useLocalStorage from './useLocalStorage'

interface AuthContextType {
  user: any
  logIn: (
    email: string,
    password: string,
    callback: VoidFunction
  ) => Promise<void>
  logOut: (callback: VoidFunction) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useLocalStorage('user', null)

  const logIn = async (
    email: string,
    password: string,
    callback: VoidFunction
  ): Promise<void> => {
    const location = window.location.hostname
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

    const response = await fetch(`http://${location}:3000/login`, settings)
    const data = await response.json()
    console.log(data.user)
    setUser(data.user)

    // navigate('/issues')
    callback()
  }

  const logOut = (callback: VoidFunction) => {
    setUser(null)
    // navigate('/', { replace: true })
    callback()
  }

  const values = useMemo(
    () => ({
      user,
      logIn,
      logOut,
    }),
    [user]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
