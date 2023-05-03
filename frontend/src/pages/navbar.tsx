import { ReactElement, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

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
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <h1>Issue Tracker</h1>
      <div className="flex gap-4">
        <BellIcon
          className={clsx('navicon', user ? 'opacity-100' : 'opacity-50')}
        />
        <UserCircleIcon
          className={clsx('navicon', user ? 'opacity-100' : 'opacity-50')}
          onClick={user ? logout : () => navigate('/login')}
        />
      </div>
    </header>
  )
}

export default NavBar
