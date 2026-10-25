import { useEffect, useRef, useState } from 'react';
import './TextCursor.css';

export default function TextCursor() {
  const cursorRef = useRef(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateHoverState = () => setCanHover(mediaQuery.matches);

    updateHoverState();
    mediaQuery.addEventListener('change', updateHoverState);

    return () => mediaQuery.removeEventListener('change', updateHoverState);
  }, []);

  useEffect(() => {
    if (!canHover) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let hasMoved = false;
    let rafId = null;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!hasMoved) {
        hasMoved = true;
        cursorX = mouseX;
        cursorY = mouseY;
      }

      // Check if pointer is hovering over headings or paragraphs
      const target = event.target;
      const isOverText = !!(
        target &&
        typeof target.closest === 'function' &&
        target.closest('h1, h2, h3, h4, h5, h6, p')
      );

      if (isOverText) {
        cursor.classList.add('is-visible');
      } else {
        cursor.classList.remove('is-visible');
      }
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('is-visible');
    };

    const handleBlur = () => {
      cursor.classList.remove('is-visible');
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      rafId = requestAnimationFrame(animateCursor);
    };

    rafId = requestAnimationFrame(animateCursor);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
    };
  }, [canHover]);

  if (!canHover) return null;

  return <div ref={cursorRef} className="cursor-line" id="cursorLine" aria-hidden="true" />;
}

