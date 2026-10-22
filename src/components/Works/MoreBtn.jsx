"use client";

import * as React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Physics config                                                            */
/* -------------------------------------------------------------------------- */
const GOO_BLUR_MIN = 3;
const GOO_BLUR_MAX = 14;
const SQUASH_MAX = 1.6;         // max stretch along movement direction
const SPEED_SQUASH_FULL = 2.2;  // px/ms at which we hit max squash
const NUM_FOLLOWERS = 4;        // trail blobs
const TAU_MULT = [1, 1.6, 2.5, 3.6];        // each follower lags more
const RADIUS_MULT = [1, 0.72, 0.5, 0.34];   // and is smaller
const HOVER_FADE = 9;           // hover progress lerp rate (1/s)

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* -------------------------------------------------------------------------- */
/*  LiquidCarveButton                                                         */
/* -------------------------------------------------------------------------- */
export default function LiquidCarveButton({
  label = "SEE MORE",
  colors = {},
  blob = {},
  icon = null,
  link = null,
  newTab = false,
  type = "button",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  /* Stable IDs for SVG defs */
  const reactId = useId();
  const idSafe = (reactId || "x").replace(/[^a-zA-Z0-9]/g, "") || "x";
  const filterId = `lc-goo-${idSafe}`;
  const maskId = `lc-mask-${idSafe}`;

  const prefer = useReducedMotion();

  /* Colors */
  const fill = colors.fill ?? "#0a0a0a";
  const hoverFill = colors.hoverFill ?? "#f5f5f5";
  const textColor = colors.textColor ?? "#fafafa";
  const hoverTextColor = colors.hoverTextColor ?? "#0a0a0a";

  /* Blob shape */
  const blobSize = blob.size ?? 0.55;               // fraction of min(w,h)
  const blobSmoothness = blob.smoothness ?? 1;      // >1 = laggier

  /* Refs + reactive state */
  const wrapperRef = useRef(null);
  const groupRefs = useRef([]);
  const radiusRef = useRef(20);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [gooBlur, setGooBlur] = useState(8);
  const [hovered, setHovered] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*  1. Measure button                                                        */
  /* ------------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*  2. Derive blob radius + goo blur from size                               */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!size.w || !size.h) return;
    const r = (Math.min(size.w, size.h) * blobSize) / 2;
    radiusRef.current = r;
    setGooBlur(Math.max(GOO_BLUR_MIN, Math.min(GOO_BLUR_MAX, r * 0.3)));
  }, [size, blobSize]);

  /* ------------------------------------------------------------------------ */
  /*  3. Physics state (mutable, no re-renders)                                */
  /* ------------------------------------------------------------------------ */
  const physRef = useRef({
    tx: 0,
    ty: 0,
    followers: Array.from({ length: NUM_FOLLOWERS }, () => ({ x: 0, y: 0 })),
    hoverProgress: 0,
    hovered: false,
    prefer: false,
    raf: null,
    lastT: 0,
  });

  useEffect(() => {
    physRef.current.hovered = hovered;
  }, [hovered]);

  useEffect(() => {
    physRef.current.prefer = !!prefer;
  }, [prefer]);

  /* ------------------------------------------------------------------------ */
  /*  4. Pointer handlers                                                      */
  /* ------------------------------------------------------------------------ */
  const setTarget = useCallback((clientX, clientY) => {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    physRef.current.tx = clientX - (r.left + r.width / 2);
    physRef.current.ty = clientY - (r.top + r.height / 2);
  }, []);

  const onEnter = useCallback(
    (e) => {
      if (disabled) return;
      const el = wrapperRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        physRef.current.tx = x;
        physRef.current.ty = y;
        // Snap the trail so we don't lerp in from off-button
        physRef.current.followers.forEach((f) => {
          f.x = x;
          f.y = y;
        });
      }
      setHovered(true);
    },
    [disabled]
  );

  const onMove = useCallback(
    (e) => {
      if (disabled) return;
      setTarget(e.clientX, e.clientY);
    },
    [disabled, setTarget]
  );

  const onLeave = useCallback(() => {
    if (disabled) return;
    setHovered(false);
  }, [disabled]);

  /* ------------------------------------------------------------------------ */
  /*  5. rAF physics loop                                                      */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const s = physRef.current;
    if (!hovered && s.hoverProgress < 0.005) return;

    let mounted = true;

    const tick = (now) => {
      if (!mounted) return;

      const dtMs = s.lastT ? Math.min(now - s.lastT, 50) : 16;
      s.lastT = now;
      const dt = dtMs / 1000;

      /* -- hover progress (fade in / out of the whole blob) ----------------- */
      const hoverTarget = s.hovered ? 1 : 0;
      const hoverRate = s.prefer ? 100 : HOVER_FADE;
      s.hoverProgress += (hoverTarget - s.hoverProgress) * Math.min(1, dt * hoverRate);

      /* -- followers -------------------------------------------------------- */
      const baseTau = 0.075 * blobSmoothness;
      let dx = 0;
      let dy = 0;
      let speed = 0;
      let prevX = 0;
      let prevY = 0;

      for (let i = 0; i < NUM_FOLLOWERS; i++) {
        const f = s.followers[i];
        const tau = s.prefer ? 0 : baseTau * (TAU_MULT[i] ?? 1);
        const alpha = tau > 0.0001 ? 1 - Math.exp(-dt / tau) : 1;

        if (i === 0) {
          prevX = f.x;
          prevY = f.y;
        }
        f.x += (s.tx - f.x) * alpha;
        f.y += (s.ty - f.y) * alpha;

        if (i === 0) {
          dx = f.x - prevX;
          dy = f.y - prevY;
          speed = Math.hypot(dx, dy) / dtMs; // px/ms
        }
      }

      /* -- squash / stretch from velocity ----------------------------------- */
      const speedNorm = s.prefer
        ? 0
        : Math.min(1, speed / SPEED_SQUASH_FULL);
      const sx = 1 + speedNorm * (SQUASH_MAX - 1);
      const sy = 1 / sx;
      const angle = speed > 0.3 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;

      const radius = radiusRef.current;
      const hp = Math.max(0, Math.min(1, s.hoverProgress));

      /* -- commit to SVG ---------------------------------------------------- */
      for (let i = 0; i < NUM_FOLLOWERS; i++) {
        const g = groupRefs.current[i];
        if (!g) continue;
        const f = s.followers[i];
        const cSx = i === 0 ? sx : 1;
        const cSy = i === 0 ? sy : 1;
        const cRot = i === 0 ? angle : 0;
        const rr = radius * (RADIUS_MULT[i] ?? 1) * hp;

        g.setAttribute(
          "transform",
          `translate(${(size.w / 2 + f.x).toFixed(2)} ${(size.h / 2 + f.y).toFixed(2)}) ` +
            `rotate(${cRot.toFixed(2)}) ` +
            `scale(${cSx.toFixed(3)} ${cSy.toFixed(3)})`
        );
        const c = g.firstElementChild;
        if (c) {
          c.setAttribute("r", Math.max(0, rr).toFixed(2));
          c.setAttribute("opacity", hp.toFixed(3));
        }
      }

      /* -- continue? -------------------------------------------------------- */
      if (mounted && (s.hovered || s.hoverProgress > 0.005)) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.raf = null;
        s.lastT = 0;
      }
    };

    s.lastT = 0;
    s.raf = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (s.raf) {
        cancelAnimationFrame(s.raf);
        s.raf = null;
      }
    };
  }, [hovered, blobSmoothness, size]);

  /* ------------------------------------------------------------------------ */
  /*  6. Tag selection (button vs. anchor)                                     */
  /* ------------------------------------------------------------------------ */
  const isLink = typeof link === "string" && link.length > 0;
  const Tag = isLink ? "a" : "button";

  const tagProps = isLink
    ? {
        href: link,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
        "aria-disabled": disabled || undefined,
      }
    : { type, disabled };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  /* ------------------------------------------------------------------------ */
  /*  7. Render                                                                */
  /* ------------------------------------------------------------------------ */
  return (
    <Tag
      ref={wrapperRef}
      {...rest}
      {...tagProps}
      onClick={handleClick}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      className={cx(
        "relative isolate inline-flex items-center justify-center gap-2",
        "select-none whitespace-nowrap rounded-full",
        "px-7 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em]",
        "cursor-pointer border-0 bg-transparent appearance-none outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
        "motion-reduce:transition-none",
        className
      )}
      style={{
        color: hovered ? hoverTextColor : textColor,
        transition: "0.25s ease ",
      }}
    >
      {/* -------------------------------------------------------------- */}
      {/*  Base fill (always visible)                                    */}
      {/* -------------------------------------------------------------- */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 rounded-full"
        style={{ backgroundColor: fill }}
      />

      {/* -------------------------------------------------------------- */}
      {/*  Masked hover-fill layer (revealed by the gooey blob)          */}
      {/* -------------------------------------------------------------- */}
      {size.w > 0 && size.h > 0 && (
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Goo filter: blur + threshold → metaball fusion */}
            <filter
              id={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={gooBlur}
                result="blur"
              />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              />
            </filter>

            {/* Mask: black background + gooey white blobs */}
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              style={{ maskType: "luminance" }}
            >
              <rect x="0" y="0" width={size.w} height={size.h} fill="black" />
              <g filter={`url(#${filterId})`}>
                {Array.from({ length: NUM_FOLLOWERS }).map((_, i) => (
                  <g
                    key={i}
                    ref={(el) => {
                      groupRefs.current[i] = el;
                    }}
                    transform="translate(0 0)"
                  >
                    <circle cx="0" cy="0" r="0" fill="white" opacity="0" />
                  </g>
                ))}
              </g>
            </mask>
          </defs>

          {/* The coloured rect the mask carves out */}
          <rect
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            fill={hoverFill}
            mask={`url(#${maskId})`}
          />
        </svg>
      )}

      {/* -------------------------------------------------------------- */}
      {/*  Content                                                       */}
      {/* -------------------------------------------------------------- */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon && (icon.side ?? "left") === "left" && <IconSlot icon={icon} />}
        <span>{label}</span>
        {icon && icon.side === "right" && <IconSlot icon={icon} />}
      </span>
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  IconSlot                                                                  */
/* -------------------------------------------------------------------------- */
function IconSlot({ icon }) {
  const dim = icon.size ?? 16;

  if (icon.type === "image" && (icon.image || icon.symbol)) {
    return (
      <img
        src={icon.image || icon.symbol}
        alt={icon.alt || ""}
        width={dim}
        height={dim}
        className="inline-block shrink-0 object-contain"
        style={{ width: dim, height: dim }}
        draggable={false}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center leading-none"
      style={{ width: dim, height: dim, fontSize: dim }}
    >
      {icon.symbol ?? "✦"}
    </span>
  );
}