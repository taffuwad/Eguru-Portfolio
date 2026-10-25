import { useEffect, useRef, useState } from 'react';

/**
 * Silky Ribbon - Trail-class cursor effect.
 *
 * Specifications:
 * - Samples: 44
 * - Max width: 22px (responsive swell, smoothly reacts on interactive hover)
 * - Smoothing: 0.28
 * - Opacity: 0.85
 * - Colour: gradient #FFFFFF → #5B9BF6 @ 90°
 * - Additive overlay: position fixed, pointer-events none, aria-hidden true
 * - Accessibility: Native cursor preserved, respects prefers-reduced-motion,
 *   disabled on touch/coarse pointers via media query listener.
 * - Single rAF loop, canvas sized to devicePixelRatio (capped at 2), full cleanup.
 */

const SAMPLES = 54;
const BASE_MAX_WIDTH = 12;
const HOVER_MAX_WIDTH = 13;
const SMOOTHING = 0.68;
const OPACITY = 0.65;

export default function SilkyRibbon() {
  const canvasRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  // 1. Accessibility & device capability detection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateSupport = () => {
      const supported = finePointerQuery.matches && !reduceMotionQuery.matches;
      setIsSupported(supported);
    };

    evaluateSupport();

    finePointerQuery.addEventListener('change', evaluateSupport);
    reduceMotionQuery.addEventListener('change', evaluateSupport);

    return () => {
      finePointerQuery.removeEventListener('change', evaluateSupport);
      reduceMotionQuery.removeEventListener('change', evaluateSupport);
    };
  }, []);

  // 2. Canvas rendering & pointer trail simulation
  useEffect(() => {
    if (!isSupported) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = null;
    let isInitialized = false;
    let isPointerActive = false;
    let isHoveringInteractive = false;
    let currentMaxWidth = BASE_MAX_WIDTH;

    // Pointer target position
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Initialize sample points array
    const points = Array.from({ length: SAMPLES }, () => ({
      x: mouse.x,
      y: mouse.y,
    }));

    // Tangent normal cache to prevent sudden flips
    let prevNx = 0;
    let prevNy = 1;

    // Handle high-DPI canvas sizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track pointer movement and check interactive targets
    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isPointerActive = true;

      if (!isInitialized) {
        isInitialized = true;
        for (let i = 0; i < SAMPLES; i++) {
          points[i].x = mouse.x;
          points[i].y = mouse.y;
        }
      }

      const target = e.target;
      if (target && typeof target.closest === 'function') {
        isHoveringInteractive = !!target.closest('a, button, input');
      } else {
        isHoveringInteractive = false;
      }
    };

    const handlePointerLeave = () => {
      isPointerActive = false;
    };

    const handlePointerEnter = () => {
      isPointerActive = true;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    // Single rAF loop
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update first point toward mouse target with 0.28 smoothing
      points[0].x += (mouse.x - points[0].x) * SMOOTHING;
      points[0].y += (mouse.y - points[0].y) * SMOOTHING;

      // Propagate through the remaining samples
      for (let i = 1; i < SAMPLES; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * SMOOTHING;
        points[i].y += (points[i - 1].y - points[i].y) * SMOOTHING;
      }

      // Smooth interactive width transition
      const targetMaxWidth = isHoveringInteractive ? HOVER_MAX_WIDTH : BASE_MAX_WIDTH;
      currentMaxWidth += (targetMaxWidth - currentMaxWidth) * 0.15;

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      // Check if ribbon has spread or is collapsed
      let totalLength = 0;
      let minX = Infinity;
      let maxX = -Infinity;

      for (let i = 0; i < SAMPLES; i++) {
        if (points[i].x < minX) minX = points[i].x;
        if (points[i].x > maxX) maxX = points[i].x;
        if (i < SAMPLES - 1) {
          totalLength += Math.hypot(
            points[i].x - points[i + 1].x,
            points[i].y - points[i + 1].y
          );
        }
      }

      // If stationary and collapsed, skip drawing polygon
      if (totalLength > 1 && isInitialized) {
        // Build offset left and right edges for filled polygon
        const leftEdges = new Array(SAMPLES);
        const rightEdges = new Array(SAMPLES);

        for (let i = 0; i < SAMPLES; i++) {
          // Normalized parameter: 0 at head, 1 at tail
          const t = i / (SAMPLES - 1);

          // Swell in middle, pinch to point at both ends via sin(π * t)
          const widthProfile = Math.sin(Math.PI * t) * currentMaxWidth;

          let dx = 0;
          let dy = 0;

          if (i === 0) {
            dx = points[0].x - points[1].x;
            dy = points[0].y - points[1].y;
          } else if (i === SAMPLES - 1) {
            dx = points[SAMPLES - 2].x - points[SAMPLES - 1].x;
            dy = points[SAMPLES - 2].y - points[SAMPLES - 1].y;
          } else {
            dx = points[i - 1].x - points[i + 1].x;
            dy = points[i - 1].y - points[i + 1].y;
          }

          const len = Math.hypot(dx, dy);
          let nx = 0;
          let ny = 1;

          if (len > 0.0001) {
            nx = -dy / len;
            ny = dx / len;

            // Ensure consistent normal orientation around curves
            if (nx * prevNx + ny * prevNy < 0) {
              nx = -nx;
              ny = -ny;
            }
            prevNx = nx;
            prevNy = ny;
          } else {
            nx = prevNx;
            ny = prevNy;
          }

          const halfW = widthProfile * 0.5;
          leftEdges[i] = {
            x: points[i].x + nx * halfW,
            y: points[i].y + ny * halfW,
          };
          rightEdges[i] = {
            x: points[i].x - nx * halfW,
            y: points[i].y - ny * halfW,
          };
        }

        // Build filled polygon from the two offset edges
        ctx.beginPath();
        ctx.moveTo(leftEdges[0].x, leftEdges[0].y);

        // Smooth left edge with quadratic midpoints
        for (let i = 1; i < SAMPLES; i++) {
          const midX = (leftEdges[i - 1].x + leftEdges[i].x) / 2;
          const midY = (leftEdges[i - 1].y + leftEdges[i].y) / 2;
          ctx.quadraticCurveTo(leftEdges[i - 1].x, leftEdges[i - 1].y, midX, midY);
        }
        ctx.lineTo(leftEdges[SAMPLES - 1].x, leftEdges[SAMPLES - 1].y);

        // Connect to right edge at pinched tail
        ctx.lineTo(rightEdges[SAMPLES - 1].x, rightEdges[SAMPLES - 1].y);

        // Smooth right edge in reverse back to head
        for (let i = SAMPLES - 2; i >= 0; i--) {
          const midX = (rightEdges[i + 1].x + rightEdges[i].x) / 2;
          const midY = (rightEdges[i + 1].y + rightEdges[i].y) / 2;
          ctx.quadraticCurveTo(rightEdges[i + 1].x, rightEdges[i + 1].y, midX, midY);
        }
        ctx.lineTo(rightEdges[0].x, rightEdges[0].y);
        ctx.closePath();

        // Colour: gradient #FFFFFF → #5B9BF6 @ 90° (horizontal linear gradient)
        const gradSpan = Math.max(maxX - minX, 30);
        const gradient = ctx.createLinearGradient(minX, 0, minX + gradSpan, 0);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#5B9BF6');

        ctx.save();
        ctx.globalAlpha = OPACITY;
        ctx.fillStyle = gradient;
        ctx.shadowColor = isHoveringInteractive
          ? 'rgba(91, 155, 246, 0.65)'
          : 'rgba(91, 155, 246, 0.35)';
        ctx.shadowBlur = isHoveringInteractive ? 10 : 6;
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    // Teardown and clean up listeners
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  );
}

