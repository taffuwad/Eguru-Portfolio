import React, { useEffect, useRef, useState } from 'react'
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Preloader from './components/Preloader/Preloader';
import Works from './components/Works/Works';
import Contact from './components/Contact/Contact';

gsap.registerPlugin(useGSAP, SplitText);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const scrollInstanceRef = useRef(null);

  useEffect(() => {
    scrollInstanceRef.current = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,
        smoothWheel: true,
      },
    });

    return () => {
      scrollInstanceRef.current?.destroy();
      scrollInstanceRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Split each h1 text into lines for the reveal animation
      const split = new SplitText(".home-copy h1", {
        type: "lines",
        linesClass: "line-child",
      });
      const hpara = new SplitText(".home .hpara", {
        type: "lines",
        linesClass: "line-child",
      });

      if (!isLoaded) {
        // Keep navbar and home h1 lines hidden before preloader completes
        gsap.set(".navbar", { y: -40, autoAlpha: 0 });
        gsap.set(split.lines, { yPercent: 120 });
        return () => split.revert();
      }

      if (reduce) {
        gsap.set(".navbar", { y: 0, autoAlpha: 1, clearProps: "transform" });
        gsap.set(split.lines, { yPercent: 0 });
        return () => split.revert();
      }

      // One unified timeline for animating navbar and home h1 after preloader
      const tl = gsap.timeline({
        delay: 0.15,
      });

      tl.fromTo(
        ".home",
        {
          clipPath:'polygon(100% 100%, 100% 100%, 0% 100%, 0% 100%)',
        },
        {
          clipPath:'polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%)',
          delay:-0.05,
          duration:1.15,
          ease: "expo.inOut",
        },
        
      )
      tl.fromTo(
        ".navbar",
        { y: -200, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform",
        }
      ).fromTo(
        split.lines,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.6"
      );
      tl.from(
        hpara.lines,{
          x:-500,
          duration: 1.1,
          opacity:0,
          stagger: 0.15,
          ease: "power4.out",
        }
      )


      const handleResize = () => {
        split.split();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        split.revert();
      };
    },
    { scope: containerRef, dependencies: [isLoaded] }
  );

  return (
    <div ref={containerRef} className='relative bg-[#fff]' data-scroll-container>
      <Preloader onLoaded={() => setIsLoaded(true)} />
      <Navbar scrollInstanceRef={scrollInstanceRef} />
      <Home />
      <About />
      <Works />
      <Contact />
    </div>
  );
};

export default App;