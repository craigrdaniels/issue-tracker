import { ReactElement, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export interface IUser {
  _id: string
  username: string
  password: string
  email: string
  created: Date
}

const NavBar = (): ReactElement => {
  const auth = useAuth()
  // const [user, setUser] = useState<IUser | null>()
  const [user, setUser] = useState<string | null>()

  const logout = async (): Promise<void> => {
    auth.logOut(() => {})
  }

  useEffect(() => {
    setUser(auth.user)
  }, [auth])

  return (
    <>
      <div className="h-5 w-screen border border-b-black">
        {user && (
          <div>
            Logged in as {user} - <a onClick={logout}>Log Out</a>
          </div>
        )}
      </div>
    </>
  )
}

export default NavBar
