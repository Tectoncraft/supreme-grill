'use client';

import { useEffect, useState } from 'react';
import { doenerstag } from '@/data/menu';
import { getDoenerstag } from '@/lib/hours';
import { fmt, type Messages } from '@/lib/i18n';
import { formatPrice } from '@/lib/price';
import styles from './DoenerstagBlock.module.css';

export default function DoenerstagBlock({ text: t }: { text: Messages['menu']['doenerstag'] }) {
  // neutral on the server, real Berlin day after mount
  const [state, setState] = useState<{ isToday: boolean; daysUntil: number } | null>(null);

  useEffect(() => {
    const update = () => setState(getDoenerstag());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const status = !state
    ? ''
    : state.isToday
      ? t.today
      : state.daysUntil === 1
        ? t.tomorrow
        : fmt(t.countdown, { n: state.daysUntil });

  return (
    <aside className={styles.block} data-today={state?.isToday ?? false}>
      <div className={styles.lead}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h3 className={styles.title}>{t.title}</h3>
        <p className={styles.status} role="status" aria-live="polite">
          {status}
        </p>
      </div>
      <ul className={styles.prices}>
        <li>
          <span className={styles.label}>{t.normal}</span>
          <span className={styles.price}>{formatPrice(doenerstag.price)}</span>
        </li>
        <li>
          <span className={styles.label}>{t.cheese}</span>
          <span className={styles.price}>{formatPrice(doenerstag.cheesePrice)}</span>
        </li>
      </ul>
    </aside>
  );
}
