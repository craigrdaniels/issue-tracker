import { Outlet } from 'react-router-dom'
import NavBar from '../pages/navbar'

const SharedRootLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default SharedRootLayout
