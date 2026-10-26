'use client';

import { useEffect, useRef, useState } from 'react';
import { categoryIcons } from './categoryIcons';
import type { CategoryId } from '@/data/menu';
import styles from './MenuTabs.module.css';

type Props = {
  label: string;
  tabs: { id: CategoryId; name: string }[];
  active: CategoryId | null;
};

export default function MenuTabs({ label, tabs, active }: Props) {
  const sentinel = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [stuck, setStuck] = useState(false);

  // stuck = the bar has reached the top of the viewport
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // keep the active tab visible in the swipeable row without moving the page
  useEffect(() => {
    const list = listRef.current;
    const link = active && list?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!list || !link) return;
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <>
      <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
      <nav className={styles.bar} data-stuck={stuck} aria-label={label}>
        <ul className={styles.list} ref={listRef}>
          {tabs.map(({ id, name }) => {
            const Icon = categoryIcons[id];
            return (
              <li key={id}>
                <a
                  href={`#menu-${id}`}
                  data-tab={id}
                  className={styles.tab}
                  aria-current={active === id ? 'true' : undefined}
                >
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  {name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
