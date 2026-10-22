import React, { useEffect, useRef } from 'react'
import Logo from '../Navbar/Logo'
import './End.css'

const End = () => {
 

  return (
    <footer  className="footer">
      <div className="footer-main">
        <div className="footer-brand footer-reveal">
          <Logo />
          
        </div>

        <nav className="footer-column footer-reveal" aria-label="Footer navigation">
          <span className="footer-label">Explore</span>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#works">Works</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-column footer-reveal">
          <span className="footer-label">Find me</span>
          <a href="#home">Whatsapp</a>
          <a href="#home">LinkedIn</a>
          <a href="#home">GitHub</a>
          <a href="#home">Facebook</a>
        </div>
      </div>

      <div className="footer-bottom footer-reveal">
        <span>© 2026 | Eguru</span>
        <span>Privacy Policy</span>
        <span>Fuwad Talukder</span>
      </div>
    </footer>
  )
}

export default End
