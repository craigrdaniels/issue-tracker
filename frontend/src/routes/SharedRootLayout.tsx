import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'
import Footer from '../pages/footer'
import AlertBar from '../pages/alert-bar'

const SharedRootLayout = () => {
  return (
    <>
      <NavBar />
      <div className="mb-auto">
        <AlertBar />
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default SharedRootLayout
