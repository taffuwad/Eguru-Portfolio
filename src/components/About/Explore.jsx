import React from 'react'
import { useNavigate } from 'react-router'

const Explore = () => {
  const navigate = useNavigate()

  return (
    <>
        <button onClick={() => navigate("/aboutpage")} className='explore flex justify-center items-center whitespace-nowrap uppercase text-base sm:text-lg md:text-2xl text-accent px-5 sm:px-8 md:px-12 lg:px-20 py-2 rounded-full border-2 border-accent'>
            Explore
        </button>
    </>
  )
}

export default Explore