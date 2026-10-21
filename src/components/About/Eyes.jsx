import { useEffect, useRef } from "react";

/* Keyframes + one state class. Tailwind can't declare @keyframes,
   so we keep these in a scoped <style> block. */
const STYLES = `
@keyframes eye-blink {
  0%, 100% { transform: scaleY(1); }
  50%      { transform: scaleY(0.06); }
}
@keyframes hint-fade {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.85; }
}
.is-blinking {
  animation: eye-blink 0.22s ease-in-out;
}
`;

const EASE = 0.22;            // 0 = frozen, 1 = instant snap
const FAR = 90;               // px at which the pupil hits full offset
const PUPIL_MARGIN = 0.92;    // keep pupil off the eye's edge
const BLINK_REMOVE_MS = 240;  // how long the .is-blinking class stays on

export default function CursorEyes() {
  const eyeRefs = useRef([]);
  const pupilRefs = useRef([]);
  const stateRef = useRef({
    pointer: { x: 0, y: 0 },
    eyes: [],                 // per-eye { x, y, max }
    rafId: 0,
  });

  /* ---------- Motion: pointer tracking + rAF loop ---------- */
  useEffect(() => {
    const state = stateRef.current;
    const eyes = eyeRefs.current;
    const pupils = pupilRefs.current;

    state.pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    state.eyes = eyes.map(() => ({ x: 0, y: 0, max: 0 }));

    const setPointer = (x, y) => {
      state.pointer.x = x;
      state.pointer.y = y;
    };
    const onMouseMove = (e) => setPointer(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    /* Recompute how far each pupil may travel. */
    const measure = () => {
      eyes.forEach((el, i) => {
        if (!el || !pupils[i]) return;
        const eyeR = el.getBoundingClientRect().width / 2;
        const pupilR = pupils[i].getBoundingClientRect().width / 2;
        state.eyes[i].max = Math.max(0, (eyeR - pupilR) * PUPIL_MARGIN);
      });
    };
    measure();
    window.addEventListener("resize", measure);

    /* rAF loop — writes transforms directly, no React re-renders. */
    const frame = () => {
      for (let i = 0; i < eyes.length; i++) {
        const el = eyes[i];
        const pupil = pupils[i];
        const eye = state.eyes[i];
        if (!el || !pupil || !eye) continue;

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const dx = state.pointer.x - cx;
        const dy = state.pointer.y - cy;
        const dist = Math.hypot(dx, dy);

        // how "hard" the eye looks: ramps with distance, capped at 1
        const strength = Math.min(dist / FAR, 1);
        const angle = Math.atan2(dy, dx);

        const targetX = Math.cos(angle) * eye.max * strength;
        const targetY = Math.sin(angle) * eye.max * strength;

        eye.x += (targetX - eye.x) * EASE;
        eye.y += (targetY - eye.y) * EASE;

        pupil.style.transform = `translate3d(${eye.x.toFixed(2)}px, ${eye.y.toFixed(2)}px, 0)`;
      }
      state.rafId = requestAnimationFrame(frame);
    };
    state.rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ---------- Blink: timed class toggle on refs ---------- */
  useEffect(() => {
    let scheduleTimer;
    let removeTimer;
    let doubleTimer;

    const triggerBlink = () => {
      eyeRefs.current.forEach((el) => el?.classList.add("is-blinking"));
      removeTimer = setTimeout(() => {
        eyeRefs.current.forEach((el) => el?.classList.remove("is-blinking"));
      }, BLINK_REMOVE_MS);
    };

    const schedule = () => {
      const delay = 1800 + Math.random() * 3800;
      scheduleTimer = setTimeout(() => {
        triggerBlink();
        // ~20% chance of a double blink
        if (Math.random() < 0.2) {
          doubleTimer = setTimeout(triggerBlink, 320);
        }
        schedule();
      }, delay);
    };
    schedule();

    return () => {
      clearTimeout(scheduleTimer);
      clearTimeout(removeTimer);
      clearTimeout(doubleTimer);
    };
  }, []);

  return (
    <div
      className="
        absolute left-0 top-0 grid h-full w-full select-none place-items-center
        overflow-hidden font-sans cursor-crosshair
        
      "
    >
      <style>{STYLES}</style>

      {/* Eye pair */}
      <div className="flex gap-[clamp(18px,5vw,48px)]">
        {[0, 1].map((i) => (
          <div
            key={i}
            ref={(el) => { eyeRefs.current[i] = el; }}
            className="
              relative grid aspect-square place-items-center overflow-hidden rounded-full
              w-[clamp(78px,17vw,150px)]
              bg-[radial-gradient(circle_at_32%_26%,#ffffff_0%,#eef3fa_45%,#c3ccdc_100%)]
              shadow-[inset_0_10px_22px_rgba(18,28,48,0.2),inset_0_-8px_16px_rgba(255,255,255,0.85),0_20px_45px_rgba(0,0,0,0.55)]
              origin-center will-change-transform
            "
          >
            <div
              ref={(el) => { pupilRefs.current[i] = el; }}
              className="
                relative aspect-square w-[46%] rounded-full will-change-transform
                bg-[radial-gradient(circle_at_34%_28%,#61729a_0%,#2b3752_42%,#080c18_100%)]
                shadow-[0_2px_6px_rgba(0,0,0,0.45),0_0_0_2px_rgba(0,0,0,0.15)]
                after:absolute after:left-[17%] after:top-[15%] after:h-[30%] after:w-[30%] after:rounded-full after:bg-white/95 after:content-['']
                before:absolute before:bottom-[18%] before:right-[20%] before:h-[13%] before:w-[13%] before:rounded-full before:bg-white/45 before:content-['']
              "
            />
          </div>
        ))}
      </div>

    </div>
  );
}