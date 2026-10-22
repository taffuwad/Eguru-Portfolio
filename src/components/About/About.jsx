import React, { useEffect, useState } from 'react'
import './About.css'
import DownloadToggle from './Cv'
import CursorEyes from './Eyes'
import Skill from './Skill'

const About = () => {
  const [enableParallax, setEnableParallax] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1025px)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1025px)')
    const updateParallax = (event) => setEnableParallax(event.matches)

    mediaQuery.addEventListener('change', updateParallax)
    return () => mediaQuery.removeEventListener('change', updateParallax)
  }, [])

  const scrollAttributes = (speed) => enableParallax
    ? { 'data-scroll': '', 'data-scroll-speed': speed }
    : {}

  return (
    <>
    <div id="about" className="about w-full">
        <div className="about-top">
            <div className="t-left a-box z-10" aria-hidden="true" {...scrollAttributes('0.2')} />
            <div className="t-right a-box flex flex-col gap-5" {...scrollAttributes('-0.2')}>
                <h1 className="uppercase ">Web development isn’t just my work — <br className="desktop-break" />it’s my passion.</h1>
                <p className='font-extralight'>
                    I'M Full-stack developer who blends thoughtful design, clean code, and creative
                    motion to build engaging web experiences. I help businesses create websites that
                    capture attention, deliver smoother user experiences, and turn visitors into potential
                    customers, while using AI automation to simplify repetitive tasks and save valuable time.
                </p>
            </div>
            
        </div>
        <div className="about-bottom">
            <div className="b-left a-box flex flex-col items-start gap-4" {...scrollAttributes('-0.2')}>
                <h1 className='font-para2'>I'M A full-stack developer</h1>
                <p className='font-main'>
                    I’m Fuwad Talukder, a full-stack developer who loves turning imagination into interactive experiences.
                    I blend clean design, creative motion, and modern web technologies to build websites that don’t just look good —
                    they feel alive. For me, every project is an opportunity to experiment, explore, and create something people remember.
                </p>

                <DownloadToggle />
            </div>
            <div className="b-right a-box relative" aria-hidden="true" {...scrollAttributes('0.2')}>
                <CursorEyes />
            </div>
        </div>
    </div>
    <Skill />
    </>
  )
}

export default About