'use client';

import { useRef, type PointerEvent } from 'react';

// Pointer-follow tilt, mouse only; skipped on touch and with reduced motion.
export function useTilt<T extends HTMLElement>(maxDeg = 6) {
  const ref = useRef<T>(null);

  const onPointerMove = (e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 2 * maxDeg).toFixed(2)}deg) rotateY(${(x * 2 * maxDeg).toFixed(2)}deg)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return { ref, onPointerMove, onPointerLeave };
}
