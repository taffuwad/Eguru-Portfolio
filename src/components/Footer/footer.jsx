import React from 'react'
import Logo from '../Navbar/Logo'
import './Footer.css'

const Footer = () => {
  return (
    <div className=' footer min-h-[30vh] w-full bg-rose-700 uppercase '>
      <div className="f-top h-[90%] bg-amber-200 w-full flex">
        <div className="logo h-full w-[40%] bg-red-950">
          <Logo />
        </div>
        <div className="nav-links h-full w-[30%] bg-red-800 flex flex-col">
            <a href="">Home</a>
            <a href="">About</a>
            <a href="">Works</a>
            <a href="">Contact</a>
        </div>
        <div className="social h-full w-[30%] flex flex-col bg-red-700">
          <a className='' href="">Whatsapp</a>
          <a className='' href="">LINKEDINE</a>
          <a className='' href="">GITHUB</a>
          <a className='' href="">FACEBOOK</a>
        </div>
      </div>
      <div className="f-bottom h-[10%] w-full flex justify-between ">
        <div className="tag1">
          © 2026 | Dario Grigoletti
        </div>
        <div className="tag2">
          Privacy Policy
        </div>
        <div className="tag3">
          Fuwad Talukder
        </div>
      </div>
    </div>
  )
}

export default Footer