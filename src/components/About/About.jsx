import React from 'react'
import aboutImg from '../../assets/hero-images/hero-about.jpg'
import './About.css'
import DownloadToggle from './Cv'
import CursorEyes from './Eyes'

const About = () => {
  return (
    <div id="about" className='about h-screen w-full ' data-scroll data-scroll-speed="0.5">
        <div className="about-top h-[50%] w-full  flex justify-between">
            <div className="t-left a-box">
            </div>
            <div className="t-right a-box flex flex-col gap-5 ">
                <h1 className=' uppercase text-4xl '>Web development isn’t just my work — <br></br>it’s my passion.</h1>
                <p className=' text-2xl'>
                    I'M Full-stack developer who blends thoughtful design, clean code, and creative
                    motion to build engaging web experiences. I help businesses create websites that
                    capture attention, deliver smoother user experiences, and turn visitors into potential
                    customers, while using AI automation to simplify repetitive tasks and save valuable time.
                </p>
            </div>
            
        </div>
        <div className="about-bottom h-[50%] w-full  flex justify-between">
            <div className="b-left a-box flex flex-col items-start gap-4">
                <h1 className='font-para2'>I'M A full-stack developer</h1>
                <p className='font-main text-2xl font-main '>
                    I’m Fuwad Talukder, a full-stack developer who loves turning imagination into interactive experiences.
                    I blend clean design, creative motion, and modern web technologies to build websites that don’t just look good —
                    they feel alive. For me, every project is an opportunity to experiment, explore, and create something people remember.
                </p>

                <DownloadToggle />
            </div>
            <div className="b-right a-box relative">
                <CursorEyes />
            </div>
        </div>
    </div>
  )
}

export default About