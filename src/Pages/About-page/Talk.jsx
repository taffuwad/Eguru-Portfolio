import { useRef, useEffect } from "react";
import "./Talk.css";

const handleClick = () => {
  const phoneNumber = "8801920409685";
  const message = "Hello! there";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const SPRING = 0.14;   // stiffness — higher = snappier
const DAMPING = 0.76;  // lower = more jelly wobble

export default function LetsTalk() {
  const sectionRef = useRef(null);
  const talkRef = useRef(null);
  const letsRef = useRef(null);
  const burstRef = useRef(null);
  const stateRef = useRef({ x: -9999, y: -9999, inside: false });
  const lettersRef = useRef([]);
  
  // Store measure function in a ref so onMove can access it
  const measureRef = useRef(null);

  useEffect(() => {
    const collect = (container, amp) =>
      Array.from(container?.querySelectorAll(".lt-letter") || []).map((el) => ({
        el,
        amp,
        sy: 0.2, sx: 1.6, ty: 60, rot: 0,
        vSy: 0, vSx: 0, vTy: 0, vRot: 0,
        kickAt: 0, kickPower: 0,
        cx: 0, cy: 0, h: 0,
      }));

    lettersRef.current = [
      ...collect(talkRef.current, 1),
      ...collect(letsRef.current, 0.45),
    ];

    const measure = () => {
      lettersRef.current.forEach((L) => {
        // 1. Temporarily remove transform to get the TRUE base position
        const currentTransform = L.el.style.transform;
        L.el.style.transform = 'none';
        
        const r = L.el.getBoundingClientRect();
        L.cx = r.left + r.width / 2;
        L.cy = r.top + r.height / 2;
        L.h = r.height;
        
        // 2. Restore the transform
        L.el.style.transform = currentTransform;
      });
    };

    // Save to ref so onMove can trigger it
    measureRef.current = measure;

    // Initial measure
    measure();

    // FIX 1: Wait for custom fonts to load, then re-measure
    if (document.fonts) {
      document.fonts.ready.then(measure);
    }

    // FIX 2: Re-measure on scroll and resize
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    // FIX 3: Re-measure if the component's layout changes
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let t = 0;

    const tick = () => {
      t += 0.016;
      const { x, y, inside } = stateRef.current;
      const now = performance.now();

      lettersRef.current.forEach((L, i) => {
        let tSy = 1, tSx = 1, tTy = Math.sin(t * 1.6 + i * 0.7) * L.h * 0.03, tRot = 0;

        if (inside && !reduced) {
          const dx = x - L.cx;
          const dy = y - L.cy;
          const dist = Math.hypot(dx, dy);
          const range = L.h * 2.1;
          const f = Math.max(0, 1 - dist / range);
          const e = f * f * (3 - 2 * f); // smoothstep
          
          tSy = 1 + 0.55 * e * L.amp;
          tSx = 1 - 0.24 * e * L.amp;
          tTy = -0.26 * L.h * e * L.amp;
          tRot = Math.max(-1, Math.min(1, dx / range)) * 10 * e;
          L.el.style.setProperty("--heat", e.toFixed(3));
        } else {
          L.el.style.setProperty("--heat", 0);
        }

        if (L.kickAt && now >= L.kickAt) {
          L.vSy += L.kickPower;
          L.vTy -= L.kickPower * L.h * 0.35;
          L.kickAt = 0;
        }

        const step = (cur, vel, target) => {
          vel += (target - cur) * SPRING;
          vel *= DAMPING;
          return [cur + vel, vel];
        };
        
        [L.sy, L.vSy] = step(L.sy, L.vSy, tSy);
        [L.sx, L.vSx] = step(L.sx, L.vSx, tSx);
        [L.ty, L.vTy] = step(L.ty, L.vTy, tTy);
        [L.rot, L.vRot] = step(L.rot, L.vRot, tRot);

        L.el.style.transform =
          `translateY(${L.ty.toFixed(2)}px) scale(${L.sx.toFixed(3)}, ${L.sy.toFixed(3)}) rotate(${L.rot.toFixed(2)}deg)`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const onMove = (e) => {
    stateRef.current = { x: e.clientX, y: e.clientY, inside: true };

    // Apply 3D tilt
    const s = sectionRef.current?.getBoundingClientRect();
    if (s && talkRef.current) {
      const px = (e.clientX - s.left) / s.width - 0.5;
      const py = (e.clientY - s.top) / s.height - 0.5;
      talkRef.current.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 8}deg)`;
    }
    
    // FIX 4: Re-measure here so the physics match the 3D tilt visual shift
    measureRef.current?.();
  };

  const onLeave = () => {
    stateRef.current.inside = false;
    if (talkRef.current) talkRef.current.style.transform = "";
  };

  const split = (word) =>
    word.split("").map((ch, i) => (
      <span key={i} className="lt-letter">
        {ch}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={handleClick}
      className="talk relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden px-4 py-8 uppercase select-none sm:px-8"
    >
      <div ref={burstRef} className="lt-burst" aria-hidden="true" />

      <h2
        ref={letsRef}
        aria-label="Let's"
        className="lt-word mm-word -ml-[50vw] lt-lets font-bold leading-[0.8]"
      >
        {split("Let's")}
      </h2>

      <h1
        ref={talkRef}
        aria-label="Talk"
        className="lt-word lt-talk font-black leading-[0.8]"
      >
        {split("Talk")}
      </h1>
    </section>
  );
}