import React from 'react'
import ProCards from './ProCards'
import './Works.css'

const Works = () => {
  return (
    <div id='works' className='works min-h-screen w-full flex flex-col gap-1 '>
        <div className="Title uppercase">
            <h1 className=' text-9xl'>Works</h1>
        </div>
        <ProCards />
        <div className="see-more-con">
            <button className='see-more px-50 py-14 m-5 text-7xl bg-accent rounded-full'>
                SEE MORE
            </button>
        </div>
    </div>
  )
}

export default Works