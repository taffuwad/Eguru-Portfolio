import React, { useEffect, useState } from 'react'
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Preloader from './components/Preloader/Preloader';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div className='relative'>
      <Preloader onLoaded={() => setIsLoaded(true)} />
      <Navbar />
      <Home isLoaded={isLoaded} />
      <About />
    </div>
  )
}

export default App