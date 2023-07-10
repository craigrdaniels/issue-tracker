import { ReactElement, useRef, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
  const [user, setUser] = useState<string | null>()
  const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false)
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const ref = useRef()

  const logout = async (): Promise<void> => {
    auth.logOut(() => {})
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setNavMenuOpen(false)
      setUserMenuOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleClickOutside, true)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setUser(auth.user)
  }, [auth])

  return (
    <div className="navbar fixed z-10 h-8 bg-base-200">
      <div className="navbar-start">
        <div className="dropdown" ref={ref}>
          <label
            tabIndex={0}
            className="swap btn-ghost swap-rotate btn-circle btn"
          >
            <input
              type="checkbox"
              className="hidden"
              checked={navMenuOpen}
              onChange={() => setNavMenuOpen((prev: boolean) => !prev)}
            />
            <Bars3Icon className="swap-off h-6 w-6" />
            <XMarkIcon className="swap-on h-6 w-6" />
          </label>
          <ul
            tabIndex={0}
            className={clsx(
              'dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow',
              !navMenuOpen && 'hidden'
            )}
          >
            <li>
              <Link to="/" onClick={() => setNavMenuOpen(false)}>
                Home
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/issues" onClick={() => setNavMenuOpen(false)}>
                  Issues
                </Link>
              </li>
            )}
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

        <div className="dropdown" ref={ref}>
          <label tabIndex={1} className="btn-ghost btn-circle btn">
            <input
              type="checkbox"
              className="hidden"
              checked={userMenuOpen}
              onChange={() => setUserMenuOpen((prev: boolean) => !prev)}
            />
            <UserCircleIcon
              className={clsx('h-6 w-6', user ? 'opacity-100' : 'opacity-50')}
            />
          </label>
          <ul
            tabIndex={0}
            className={clsx(
              'dropdown-content menu rounded-box menu-compact mt-3 w-52 -translate-x-3/4 bg-base-200 p-2 shadow',
              !userMenuOpen && 'hidden'
            )}
          >
            {user ? (
              <>
                <li>
                  <Link to="/user" onClick={() => setUserMenuOpen(false)}>
                    User Info
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={() => setUserMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NavBar
