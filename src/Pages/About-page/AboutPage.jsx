'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './AboutPage.css';
import Navbar from '../../components/Navbar/Navbar';
import End from '../../components/End/End';
import HERO_PHOTO from '../../assets/hero-images/about.jpg'
import InteractiveTalk from './Talk';

const SKILLS = [
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Tailwind CSS',
  'GSAP',
  'Lenis',
  'Matter.js',
  'Claude',
  'ChatGPT',
];

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
          <div className="parallax__black-line-overflow pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-black" />

          {/* Layers: extend 30% above/below so translation never reveals an edge */}
          <div
            data-parallax-layers
            className="parallax__layers absolute inset-y-[-30%] inset-x-0 will-change-transform"
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
          <div className="parallax__fade pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/3 bg-linear-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="parallax__content">
          <div
            className="about-page min-h-screen overflow-x-hidden z-10 text-[#f2f2f0]"
          >
            <div className="about-page-inner px-[clamp(14px,1.6vw,26px)]">

              <main>
                {/* ============ Statement + bio ============ */}
                <div className="about-intro-grid grid grid-cols-1 items-start gap-y-11 pt-[clamp(0.5rem,2vh,1.5rem)] min-[1024px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[1024px]:gap-x-[clamp(2rem,6vw,6rem)] min-[1024px]:gap-y-0">
                  <h1 className="about-statement font-fraunces m-0 uppercase leading-[0.99] tracking-[0.005em] text-[#8c8c8c]">
                    <span className="at1 block whitespace-nowrap">
                      I'M Fuwad Talukder
                    </span>
                    <span className="at2 block whitespace-nowrap">
                      a full&#8209;stack developer
                    </span>
                  </h1>

                  <div className="about-copy max-w-[62ch] space-y-[1.5em] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.65] text-[#f2f2f0] [&>p]:m-0 min-[1024px]:max-w-[52ch]">
                      <p>
                        His work turns imagination into interactive experiences,
                        translating an idea into websites built on thoughtful design,
                        clean code and creative motion.
                      </p>
                      <p>
                        His approach is rooted in a simple belief: a website should not
                        just look good — it should feel alive.
                      </p>
                      <p>
                        Every project starts with the experience: understanding the
                        visitor first, then selecting the design, technology and motion
                        that best serve it. This balance between concept and execution
                        runs through everything, from a single interaction to a full
                        user journey.
                      </p>
                      <p>
                        He works across the full build — interface and experience on the
                        front end, systems and data behind it — crafting motion with the
                        same care as the code that carries it.
                      </p>
                      <p>
                        He helps businesses create websites that capture attention,
                        deliver smoother user experiences, and turn visitors into
                        potential customers.
                      </p>
                      <p>
                        His practice has since extended into AI — prompt and context
                        engineering, automation and agents that simplify repetitive
                        tasks and save valuable time. Driven by curiosity, he treats
                        every project as an opportunity to experiment, explore, and
                        create something people remember.
                      </p>
                    </div>
                </div>

                {/* ============ Image + Works with ============ */}
                <div className="about-image-grid mt-14 grid grid-cols-1 items-start gap-y-11 min-[1024px]:mt-[clamp(4rem,11vh,8.5rem)] min-[1024px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[1024px]:gap-x-[clamp(2rem,6vw,6rem)] min-[1024px]:gap-y-0">
                  <figure className="m-0 overflow-hidden">
                    <img
                      src={HERO_PHOTO}
                      alt="Sun breaking over a sea of clouds above mountain ridges at dawn"
                      loading="lazy"
                      className="hero-about-img block h-auto aspect-16/10 w-full object-cover object-[center_38%] saturate-[.88] contrast-[1.02]"
                    />
                  </figure>

                  <section aria-labelledby="works-with">
                    <h2
                      id="works-with"
                      className="font-fraunces mb-[1.6rem] text-[1.45rem] tracking-[0.01em] text-[#f2f2f0]"
                    >
                      Works with
                    </h2>

                    <ul className="m-0 list-none p-0">
                      {SKILLS.map((skill) => (
                        <li
                          key={skill}
                          className="border-t border-[rgba(242,242,240,0.28)] py-[0.72rem] text-[0.95rem] leading-[1.4] text-[#f2f2f0] last:border-b"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* ============ Footer ============ */}

              </main>
            </div>
          </div>
          



          <InteractiveTalk />
      </section>
    </div>

    <End />
    </>
  );
}