import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'
import Footer from '../pages/footer'
import AlertBar from '../pages/alert-bar'
import { useAlert } from '../hooks/useAlert'
import clsx from 'clsx'

const SharedRootLayout = () => {
  const { alert } = useAlert()

  return (
    <>
      <NavBar />
      <div
        className={clsx(
          'mb-auto transition-all duration-700',
          alert ? 'translate-y-5 pb-10' : 'translate-y-0 pb-4'
        )}
      >
        <AlertBar />
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default SharedRootLayout
