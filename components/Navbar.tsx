'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { activeNavSections as navSections, site } from '@/config/site';
import type { Locale, Messages } from '@/lib/i18n';
import { getLenis } from '@/lib/lenis';
import LanguageSwitch from './LanguageSwitch';
import OpenBadge from './OpenBadge';
import styles from './Navbar.module.css';

type Props = {
  locale: Locale;
  nav: Messages['nav'];
  badge: Messages['badge'];
  days: Messages['days'];
  lang: Messages['lang'];
};

export default function Navbar({ locale, nav, badge, days, lang }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>('start');
  const [underline, setUnderline] = useState<{ x: number; w: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  // glass after 80px, hide on scroll down / show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        setScrolled(y > 80);
        if (!menuOpenRef.current && Math.abs(y - last) > 6) {
          setHidden(y > last && y > 160);
        }
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // active section
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
          seen.add(e.target.id);
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    );
    for (const { id } of navSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // sliding underline position
  useEffect(() => {
    const measure = () => {
      const link = linkRefs.current[active];
      const list = listRef.current;
      if (!link || !list) return setUnderline(null);
      const l = link.getBoundingClientRect();
      const p = list.getBoundingClientRect();
      setUnderline({ x: l.left - p.left, w: l.width });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, locale]);

  // full-screen menu: lock scroll, close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // lets the sticky menu tabs sit below the navbar only while it is visible
  useEffect(() => {
    document.documentElement.dataset.nav = hidden && !menuOpen ? 'hidden' : 'shown';
  }, [hidden, menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled}
      data-hidden={hidden && !menuOpen}
      data-open={menuOpen}
    >
      <div className={styles.bar}>
        <a href="#start" className={styles.logo} aria-label={nav.home} onClick={close}>
          <Image src="/assets/logo.svg" alt="" width={52} height={52} priority />
        </a>

        <nav className={styles.desktopNav} aria-label={nav.main}>
          <ul className={styles.list} ref={listRef}>
            {navSections.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  ref={(el) => {
                    linkRefs.current[id] = el;
                  }}
                  className={styles.link}
                  aria-current={active === id ? 'true' : undefined}
                >
                  {nav[key]}
                </a>
              </li>
            ))}
            <span
              className={styles.underline}
              aria-hidden="true"
              style={
                underline
                  ? { transform: `translateX(${underline.x}px) scaleX(${underline.w})`, opacity: 1 }
                  : undefined
              }
            />
          </ul>
        </nav>

        <div className={styles.right}>
          <div className={styles.desktopOnly}>
            <OpenBadge badge={badge} days={days} />
          </div>
          <LanguageSwitch locale={locale} labels={lang} sectionId={active} />
          <a href={site.phoneHref} className={styles.call}>
            {nav.call}
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.overlay} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav aria-label={nav.main}>
          <ul className={styles.overlayList}>
            {navSections.map(({ id, key }, i) => (
              <li key={id} style={{ ['--i' as string]: i }}>
                <a href={`#${id}`} onClick={close} aria-current={active === id ? 'true' : undefined}>
                  {nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.overlayFoot} style={{ ['--i' as string]: navSections.length }}>
          <OpenBadge badge={badge} days={days} />
          <a href={site.phoneHref} className={styles.callBig}>
            {nav.call} · {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
