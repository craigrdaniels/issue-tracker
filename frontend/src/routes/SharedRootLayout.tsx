import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'
import Footer from '../pages/footer'

const SharedRootLayout = () => {
  return (
    <>
      <NavBar />
      <div className="mb-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default SharedRootLayout
