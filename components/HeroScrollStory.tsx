'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { routeUrl, site } from '@/config/site';
import { scrollStory as cfg } from '@/config/scrollStory';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { fmt, type Messages } from '@/lib/i18n';
import styles from './HeroScrollStory.module.css';

type Props = { hero: Messages['hero']; intro: Messages['menuIntro'] };
type Mode = 'pending' | 'scrub' | 'loop';
type Variant = 'desktop' | 'mobile';

export default function HeroScrollStory({ hero, intro }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const [variant, setVariant] = useState<Variant>('desktop');
  const [videoSrc, setVideoSrc] = useState<string | undefined>();

  // decide scrub vs. loop and which file to use (never during render)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia(`(max-width: ${cfg.mobileMaxWidth}px)`);
    const decide = () => {
      setVariant(mobile.matches ? 'mobile' : 'desktop');
      setMode(reduce.matches || (mobile.matches && !cfg.scrubOnMobile) ? 'loop' : 'scrub');
    };
    decide();
    reduce.addEventListener('change', decide);
    mobile.addEventListener('change', decide);
    return () => {
      reduce.removeEventListener('change', decide);
      mobile.removeEventListener('change', decide);
    };
  }, []);

  // Scrub mode loads the whole file into memory first, so every seek is local
  // (no range requests); loop mode just streams it.
  useEffect(() => {
    if (mode === 'pending') return;
    const src = cfg.sources[variant].src;
    if (mode === 'loop') {
      setVideoSrc(src);
      return;
    }
    let cancelled = false;
    let url: string | undefined;
    setVideoSrc(undefined);
    fetch(src)
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setVideoSrc(url);
      })
      .catch(() => !cancelled && setVideoSrc(src));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [mode, variant]);

  // iOS only seeks a paused video reliably after it has been "played" once
  useEffect(() => {
    if (mode !== 'scrub') return;
    const video = videoRef.current;
    if (!video) return;
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', unlock);
  }, [mode, variant]);

  useGSAP(
    (_ctx, contextSafe) => {
      const video = videoRef.current;
      if (mode !== 'scrub' || !videoSrc || !video || !contextSafe) return;
      video.pause();
      let stopTick: (() => void) | undefined;

      const build = contextSafe(() => {
        const { overlayA: a, overlayB: b, scrim, scrollHint: h, endFade: e } = cfg;
        // overlays share one paused timeline, driven by the same smoothed progress as the video
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
        tl.to(hintRef.current, { opacity: 0, duration: h.fadeEnd }, 0);
        tl.to(aRef.current, { opacity: 0, y: -a.moveUpPx, duration: a.fadeEnd - a.visibleUntil }, a.visibleUntil);
        tl.set(aRef.current, { pointerEvents: 'none' }, a.fadeEnd - 0.05);
        tl.fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: scrim.end - scrim.start }, scrim.start);
        tl.fromTo(
          bRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: b.fadeInEnd - b.fadeInStart },
          b.fadeInStart,
        );
        tl.set(bRef.current, { pointerEvents: 'auto' }, b.fadeInStart + 0.05);
        tl.fromTo(fadeRef.current, { opacity: 0 }, { opacity: 1, duration: e.end - e.start }, e.start);

        let target = 0;
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            target = self.progress;
          },
        });

        const lastFrame = Math.max(0, video.duration - 0.05);
        target = st.progress;
        let shown = target;
        let applied = -1;
        let lastSeek = 0;
        let last = performance.now();
        tl.progress(shown);

        const D = lastFrame || 1;
        const epsilon = 1 / (cfg.fps * D); // one frame, as progress
        const snap = (p: number) => Math.round(p * D * cfg.fps) / cfg.fps;

        const tick = () => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000);
          last = now;
          const diff = target - shown;

          if (diff > epsilon) {
            // behind the scroll: play forward natively, rate proportional to the gap, so it eases to a stop
            const rate = Math.min(cfg.maxVideoSpeed, Math.max(cfg.minRate, (diff * D) / cfg.follow));
            if (Math.abs(video.playbackRate - rate) > 0.02) video.playbackRate = rate;
            if (video.paused) video.play().catch(() => {});
            if (!video.seeking) shown = Math.min(1, video.currentTime / D);
            applied = -1;
          } else {
            if (!video.paused) video.pause();
            if (Math.abs(diff) > 1e-4) {
              // ahead of the video (scrolling up): eased, speed-capped seek
              const maxStep = (cfg.maxVideoSpeed * dt) / D;
              shown += Math.max(-maxStep, Math.min(maxStep, diff * (1 - Math.exp(-dt / cfg.follow))));
            } else {
              shown = target;
            }
            const frame = snap(shown);
            if (frame !== applied && (!video.seeking || now - lastSeek > 150)) {
              video.currentTime = frame;
              applied = frame;
              lastSeek = now;
            }
          }
          tl.progress(Math.min(1, Math.max(0, shown)));
        };

        // too fast: hold wheel-down while the animation is far behind the scroll position
        const holdBack = (e: WheelEvent) => {
          const inStory = st.isActive;
          if (inStory && e.deltaY > 0 && target - shown > cfg.maxLead) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        };
        window.addEventListener('wheel', holdBack, { passive: false, capture: true });
        video.playbackRate = 1;
        gsap.ticker.add(tick);
        stopTick = () => {
          gsap.ticker.remove(tick);
          window.removeEventListener('wheel', holdBack, { capture: true });
          video.pause();
          video.playbackRate = 1;
        };
      });

      if (video.readyState >= 1) build();
      else video.addEventListener('loadedmetadata', build, { once: true });
      return () => {
        video.removeEventListener('loadedmetadata', build);
        stopTick?.();
      };
    },
    { dependencies: [mode, variant, videoSrc], scope: sectionRef, revertOnUpdate: true },
  );

  const source = cfg.sources[variant];
  const loop = mode === 'loop';

  return (
    <section
      id="start"
      ref={sectionRef}
      className={`${styles.story} ${loop ? styles.loop : ''}`}
      style={{ ['--story-h' as string]: `${cfg.heightVh}vh` }}
      data-mode={mode}
    >
      <div className={styles.stage}>
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          poster={source.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          autoPlay={loop}
          loop={loop}
          aria-hidden="true"
          tabIndex={-1}
        />
        <div ref={scrimRef} className={styles.scrim} />
        <div ref={fadeRef} className={styles.endFade} />

        <div ref={aRef} className={styles.overlayA}>
          <Image src="/assets/logo.svg" alt={hero.logoAlt} width={120} height={120} priority className={styles.logo} />
          <h1 className={styles.title}>{site.name}</h1>
          <p className={styles.subtitle}>{fmt(hero.subtitle, { year: site.since, city: site.city })}</p>
          <div className={styles.buttons}>
            <a href="#speisekarte" className={styles.primary}>
              {hero.menu}
            </a>
            <a href={routeUrl} className={styles.secondary} target="_blank" rel="noopener noreferrer">
              {hero.route}
            </a>
          </div>
        </div>

        <div ref={bRef} className={styles.overlayB}>
          <h2 className={styles.introTitle}>{intro.title}</h2>
          <p className={styles.introText}>{intro.tagline}</p>
          <ul className={styles.tabs} aria-label={intro.tabsLabel}>
            {Object.entries(intro.tabs).map(([key, label]) => (
              <li key={key}>
                <a href={`#menu-${key}`}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div ref={hintRef} className={styles.hint} aria-hidden="true">
          <span>{hero.scroll}</span>
          <i />
        </div>
      </div>
    </section>
  );
}
