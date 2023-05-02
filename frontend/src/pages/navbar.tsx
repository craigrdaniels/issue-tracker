import { ReactElement, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navigation from '../components/Navigation'
import clsx from 'clsx'

export interface IUser {
  _id: string
  username: string
  password: string
  email: string
  created: Date
}

const navigation = [
  { title: 'Issues', href: 'issues' },
  { title: 'Messages', href: 'messages' },
]

const NavBar = (): ReactElement => {
  const auth = useAuth()
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
      <Navigation navigation={navigation} />
      <div className="text-base lg:text-sm">
        {user && (
          <div>
            Logged in as {user} -{' '}
            <a onClick={logout} className="cursor-pointer">
              Log Out
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavBar
