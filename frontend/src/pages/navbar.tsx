import { ReactElement, useRef, useEffect, useState } from 'react'
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
  const [user, setUser] = useState<string | null>()
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const ref = useRef()

  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const logout = async (): Promise<void> => {
    auth.logOut(() => {})
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDropdownOpen(false)
    }
  }
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', handleClickOutside, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setUser(auth.user)
  }, [auth])

  const handledropdownClick = () => {
    setDropdownOpen(false)
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown" ref={ref}>
          <label
            tabIndex={0}
            className="btn-ghost btn-circle btn"
            onClick={() => setDropdownOpen((prev: boolean) => !prev)}
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          <ul
            tabIndex={0}
            className={clsx(
              'dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow',
              !dropdownOpen && 'hidden'
            )}
          >
            <li>
              <Link to="/" onClick={handledropdownClick}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/issues" onClick={handledropdownClick}>
                Issues
              </Link>
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
