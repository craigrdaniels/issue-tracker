import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'
import Footer from '../pages/footer'
import AlertBar from '../pages/alert-bar'
import clsx from 'clsx'

const SharedRootLayout = () => {
  return (
    <>
      <NavBar />
      <div className={clsx('mb-auto transition-all duration-700')}>
        <AlertBar />
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default SharedRootLayout
