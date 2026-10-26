'use client';

import { useEffect, useState } from 'react';
import { fmt, type Messages } from '@/lib/i18n';
import { getOpenState, type OpenState } from '@/lib/hours';
import styles from './OpenBadge.module.css';

type Props = { badge: Messages['badge']; days: Messages['days'] };

export default function OpenBadge({ badge, days }: Props) {
  // neutral on the server; filled in after mount to avoid hydration mismatch
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const text = !state
    ? ''
    : state.open
      ? fmt(badge.open, { time: state.closesAt })
      : fmt(badge.closed, { day: days[state.nextDay], time: state.opensAt });

  return (
    <span
      className={styles.badge}
      data-state={state ? (state.open ? 'open' : 'closed') : 'pending'}
      role="status"
      aria-live="polite"
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>{text}</span>
    </span>
  );
}
