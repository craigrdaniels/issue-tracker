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

  useEffect(() => {
    setUser(auth.user)
  }, [useAuth])

  return (
    <>
      <div className="h-5 w-screen border border-b-black">{user}</div>
    </>
  )
}

export default NavBar
