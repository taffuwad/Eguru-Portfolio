import React from 'react'
import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const App = () => {

  useEffect(() => {
  const locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      lerp: 0.08,
      smoothWheel: true,
    },
  });

  return () => {
    locomotiveScroll.destroy();
  };
}, []);


  return (
    <div className=''>
      <div className="1 h-screen w-full bg-rose-500">

      </div>
      <div className="1 h-screen w-full bg-blue-500"></div>
    </div>
  )
}

export default App