import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'
import Footer from '../pages/footer'
import AlertBar from '../pages/alert-bar'
import clsx from 'clsx'

const SharedRootLayout = () => {
  return (
    <>
      <NavBar />
      <AlertBar />
      <div className={clsx('mb-auto pb-4 pt-16 transition-all duration-700')}>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default SharedRootLayout
