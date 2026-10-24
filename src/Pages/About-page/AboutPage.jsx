'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './AboutPage.css';
import Navbar from '../../components/Navbar/Navbar';
import End from '../../components/End/End';

export function AboutPage() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');
    let tl = null;
    if (triggerElement) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
        },
      });

      const layers = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          { yPercent: layerObj.yPercent, ease: 'none' },
          idx === 0 ? undefined : '<'
        );
      });
    }

    const lenis = new Lenis({ autoRaf: true });
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
      lenis.destroy();
    };
  }, []);

  return (
    <>
    <Navbar />
    <div id='about-page' className="parallax relative isolate bg-[#0b0b0b] -mt-2 text-white" ref={parallaxRef}>
      {/* ============ HERO ============ */}
      <section className="parallax__header relative h-screen w-full overflow-hidden">
        <div className="parallax__visuals absolute inset-0">
          {/* Top black strip — covers sub-pixel gaps during fast scroll */}
          <div className="parallax__black-line-overflow pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-black" />

          {/* Layers: extend 30% above/below so translation never reveals an edge */}
          <div
            data-parallax-layers
            className="parallax__layers absolute -inset-y-[30%] inset-x-0 will-change-transform"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/a4/a43f4eae3459c461345ee676f12d6e1ddca65e8a5279a5af00d475b17ff83aea.webp"
              loading="eager"
              width="800"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <img
              src="https://cdn.21st.dev/assets/mirror/50/50ca6a0d36d2780bfcb469d6db7eaec0be7e0d2961ba69a63d2a1473b040338d.webp"
              loading="eager"
              width="800"
              data-parallax-layer="2"
              alt=""
              className="parallax__layer-img absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div
              data-parallax-layer="3"
              className="parallax__layer-title absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <h2 className="parallax__title select-none text-center text-[clamp(4rem,14vw,12rem)] font-black uppercase leading-none tracking-tighter drop-shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
                Fuwad Talukder
              </h2>
            </div>
            <img
              src="https://cdn.21st.dev/assets/mirror/e1/e1c8137b5f971c3b3ec1a0f9e79b9c17018767005f844a10082b890472afecfb.webp"
              loading="eager"
              width="800"
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img absolute inset-0 h-full w-full object-cover will-change-transform"
            />
          </div>

          {/* Bottom fade into the content section */}
          <div className="parallax__fade pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="parallax__content relative min-h-screen w-full  bg-[#0b0b0b]">
        

      </section>
    </div>

    <End />
    </>
  );
}