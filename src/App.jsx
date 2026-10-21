import React from 'react'
import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';

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
      <Navbar />
      <Home />
    </div>
  )
}

export default App