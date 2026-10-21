import React from 'react'
import Logo from './Logo'
import'./Nav.css'
import NavSection from './NavSection'

const Navbar = () => {
  return (
    <div className=' navbar fixed top-0 left-0 w-full flex justify-between items-center '>
        <Logo />
        <NavSection />
    </div>
  )
}

export default Navbar