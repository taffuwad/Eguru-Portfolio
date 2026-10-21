import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from "gsap/SplitText";
import './home.css'

const Home = ({ isLoaded = false }) => {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const lines = rootRef.current.querySelectorAll("h1");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!isLoaded) {
        // Hide immediately so nothing flashes before the reveal
        gsap.set(lines, { yPercent: 40, autoAlpha: 0 });
        return;
      }

      gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: reduce ? 0.01 : 1.1,
        stagger: reduce ? 0 : 0.12,
        ease: "expo.out",
      });
    },
    { scope: rootRef, dependencies: [isLoaded] }
  );



  return (
    <div
      id="home"
      ref={rootRef}
      className='home h-screen w-full flex justify-center items-end'
    >
      <div className='home-copy text-text-light uppercase text-center font-main font-bold'>
        <h1>Every great trick</h1>
        <h1>has three</h1>
        <h1>parts.Your website</h1>
        <h1>is the Prestige.</h1>
      </div>
    </div>
  )
}

export default Home