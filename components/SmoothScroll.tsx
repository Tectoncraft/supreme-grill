'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/lenis';

// Inertial wheel scrolling: the page keeps gliding after the wheel stops and
// the glide scales with how fast you scrolled. Runs on GSAP's ticker so the
// hero scrub, overlays and scroll position all update in the same frame.
// Touch keeps the browser's native momentum; reduced motion turns it off.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
