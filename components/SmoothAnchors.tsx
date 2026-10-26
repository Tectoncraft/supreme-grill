'use client';

import { useEffect } from 'react';
import { scrollStory } from '@/config/scrollStory';
import { gsap } from '@/lib/gsap';
import { getLenis } from '@/lib/lenis';

// In-page links scroll at a capped speed instead of jumping, so the scrubbed
// hero video plays through at a normal pace when someone clicks "Speisekarte".
export default function SmoothAnchors() {
  useEffect(() => {
    const { maxPxPerSec, minSec, maxSec } = scrollStory.anchorScroll;
    let tween: gsap.core.Tween | null = null;
    let anchorRunning = false;
    // a manual wheel/touch/key press cancels a running anchor scroll (and only then)
    const stop = () => {
      tween?.kill();
      tween = null;
      if (!anchorRunning) return;
      anchorRunning = false;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(lenis.scroll, { immediate: true });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!link || link.target === '_blank') return;
      const url = new URL(link.href, window.location.href);
      const strip = (p: string) => p.replace(/\/$/, '');
      if (url.origin !== window.location.origin || strip(url.pathname) !== strip(window.location.pathname)) return;
      const el = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (!el) return;

      e.preventDefault();
      history.pushState(null, '', url.hash);
      // let an open mobile menu release its scroll lock first
      window.setTimeout(() => {
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        const to = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - margin));
        const from = window.scrollY;
        stop();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          window.scrollTo(0, to);
          return;
        }
        const duration = Math.min(maxSec, Math.max(minSec, Math.abs(to - from) / maxPxPerSec));
        const lenis = getLenis();
        if (lenis) {
          anchorRunning = true;
          lenis.scrollTo(to, {
            duration,
            onComplete: () => {
              anchorRunning = false;
            },
            easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
          });
          return;
        }
        const pos = { y: from };
        tween = gsap.to(pos, {
          y: to,
          duration,
          ease: 'power1.inOut',
          onUpdate: () => window.scrollTo(0, pos.y),
          onComplete: stop,
        });
      }, 60);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      stop();
    };
  }, []);

  return null;
}
