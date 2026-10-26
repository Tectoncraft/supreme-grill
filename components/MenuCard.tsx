'use client';

import type { MenuItem } from '@/data/menu';
import type { Messages } from '@/lib/i18n';
import { formatPrice } from '@/lib/price';
import { useTilt } from '@/lib/useTilt';
import MenuImage from './MenuImage';
import styles from './MenuCard.module.css';

type Props = { item: MenuItem; menu: Messages['menu'] };

export default function MenuCard({ item, menu }: Props) {
  const tilt = useTilt<HTMLElement>(6);
  const desc = (menu.items as Record<string, string>)[item.id];

  return (
    <div className={`${styles.reveal} card`}>
      <article className={styles.card} {...tilt}>
        <MenuImage image={item.image} alt={item.name} category={item.category} soon={menu.imageSoon} />
        <div className={styles.body}>
          <h4 className={styles.head}>
            <span className={styles.name}>{item.name}</span>
            {item.price !== undefined && (
              <>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.price}>{formatPrice(item.price)}</span>
              </>
            )}
          </h4>
          {desc && <p className={styles.desc}>{desc}</p>}
          {item.variants && (
            <ul className={styles.variants}>
              {item.variants.map((v) => (
                <li key={v.id}>
                  <span className={styles.vlabel}>{menu.variants[v.id]}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.price}>{formatPrice(v.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </div>
  );
}
