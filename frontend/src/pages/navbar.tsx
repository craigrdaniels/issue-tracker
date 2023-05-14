import { ReactElement, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate, Link } from 'react-router-dom'

export interface IUser {
  _id: string
  username: string
  password: string
  email: string
  created: Date
}

const NavBar = (): ReactElement => {
  const auth = useAuth()
  const navigate = useNavigate()
  // const [user, setUser] = useState<IUser | null>()
  const [user, setUser] = useState<string | null>()

  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const logout = async (): Promise<void> => {
    auth.logOut(() => {})
  }

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setUser(auth.user)
  }, [auth])

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle btn">
            <Bars3Icon className="h-6 w-6" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/issues">Issues</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="text-lg">
          Issue-Tracker
        </Link>
      </div>
      <div className="navbar-end">
        <div className="btn-ghost btn-circle btn">
          <BellIcon
            className={clsx('h-6 w-6', user ? 'opacity-100' : 'opacity-50')}
          />
        </div>

        <div className="btn-ghost btn-circle btn">
          <UserCircleIcon
            className={clsx('h-6 w-6', user ? 'opacity-100' : 'opacity-50')}
            onClick={user ? logout : () => navigate('/login')}
          />
        </div>
      </div>
    </div>
  )
}

export default NavBar
