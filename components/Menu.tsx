'use client';

import { useEffect, useRef, useState } from 'react';
import { categories, menuItems, type CategoryId } from '@/data/menu';
import { gsap, useGSAP } from '@/lib/gsap';
import type { Messages } from '@/lib/i18n';
import AllergenInfo from './AllergenInfo';
import DoenerstagBlock from './DoenerstagBlock';
import MenuCard from './MenuCard';
import MenuTabs from './MenuTabs';
import PizzaBuilder from './PizzaBuilder';
import styles from './Menu.module.css';

export default function Menu({ menu }: { menu: Messages['menu'] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [veggieOnly, setVeggieOnly] = useState(false);
  const [active, setActive] = useState<CategoryId | null>(null);

  const visible = categories
    .map(({ id }) => ({
      id,
      items: menuItems.filter((i) => i.category === id && (!veggieOnly || i.veggie)),
    }))
    .filter((c) => c.id === 'pizza' || c.items.length > 0);

  // highlight the category in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id.replace('menu-', '') as CategoryId);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    rootRef.current?.querySelectorAll('[data-category]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [veggieOnly]);

  // cards fade up once, staggered, when they first scroll into view
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cards = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.card:not([data-seen])') ?? []);
      if (!cards.length) return;
      gsap.set(cards, { opacity: 0, y: 24 });
      const io = new IntersectionObserver(
        (entries) => {
          const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
          if (!shown.length) return;
          shown.forEach((el) => {
            el.dataset.seen = '1';
            io.unobserve(el);
          });
          gsap.to(shown, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      cards.forEach((c) => io.observe(c));
      return () => io.disconnect();
    },
    { dependencies: [veggieOnly], scope: rootRef },
  );

  return (
    <section id="speisekarte" ref={rootRef} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{menu.eyebrow}</p>
            <h2 className={styles.title}>{menu.title}</h2>
          </div>
          <div className={styles.controls}>
            <p className={styles.lead}>{menu.lead}</p>
            <button
              type="button"
              role="switch"
              aria-checked={veggieOnly}
              className={styles.toggle}
              onClick={() => setVeggieOnly((v) => !v)}
            >
              <span className={styles.track} aria-hidden="true">
                <span className={styles.knob} />
              </span>
              {menu.veggieOnly}
            </button>
            <AllergenInfo text={menu.allergens} />
          </div>
        </header>
        <DoenerstagBlock text={menu.doenerstag} />
      </div>

      <div className={styles.body}>
        <MenuTabs
          label={menu.tabsLabel}
          active={active}
          tabs={visible.map(({ id }) => ({ id, name: menu.categories[id].name }))}
        />
        <div className={`${styles.container} ${styles.categories}`}>
          {visible.map(({ id, items }) => (
            <section key={id} id={`menu-${id}`} data-category className={styles.category}>
              <header className={styles.catHead}>
                <h3 className={styles.catTitle}>{menu.categories[id].name}</h3>
                {menu.categories[id].note && <p className={styles.catNote}>{menu.categories[id].note}</p>}
              </header>
              {id === 'pizza' ? (
                <PizzaBuilder text={menu.pizza} veggieOnly={veggieOnly} />
              ) : (
                <div className={styles.grid}>
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} menu={menu} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
