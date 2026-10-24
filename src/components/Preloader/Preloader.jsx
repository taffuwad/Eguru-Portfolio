import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Preloader.css";
import heroBg from "../../assets/hero-images/hero-bg.png";

const Preloader = ({ onLoaded }) => {
  const rootRef = useRef(null);
  const counterRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Lock scroll while loading
      document.documentElement.style.overflow = "hidden";

      const counter = { value: 0 };
      const tl = gsap.timeline({ paused: true });

      tl.to(counter, {
        value: 100,
        duration: reduce ? 0.2 : 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(
              Math.round(counter.value)
            ).padStart(2, "0");
          }
        },
      })
        .to(
          root,
          {
            yPercent: -100,
            duration: reduce ? 0.01 : 1.1,
            ease: "expo.inOut",
            onStart: () => {
              // Trigger navbar and hero animation right as curtain starts unveiling
              onLoaded?.();
            },
            onComplete: () => {
              document.documentElement.style.overflow = "";
            },
          },
          "+=0.1"
        )
        .set(root, { display: "none" });

      // Wait for critical assets (fonts + hero background)
      const preloadImage = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = resolve;
        });

      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        preloadImage(heroBg),
      ]).then(() => tl.play());

      return () => {
        tl.kill();
        document.documentElement.style.overflow = "";
      };
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader-counter font-para2">
        <span ref={counterRef}>00</span><span>%</span>
      </div>
    </div>
  );
};

export default Preloader;
