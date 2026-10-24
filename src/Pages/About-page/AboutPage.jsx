'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './AboutPage.css';

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
    <div className="parallax relative isolate bg-[#0b0b0b] text-white" ref={parallaxRef}>
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
                Parallax
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
      <section className="parallax__content relative flex min-h-screen w-full items-center justify-center bg-[#0b0b0b]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 160 160"
          fill="none"
          aria-hidden="true"
          className="osmo-icon-svg mx-auto h-auto w-full max-w-[10rem] text-white md:max-w-[14rem]"
        >
          <path
            d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z"
            fill="currentColor"
          />
        </svg>
      </section>
    </div>
  );
}