'use client';

import { useRouter } from 'next/navigation';
import { locales, storageKey, type Locale, type Messages } from '@/lib/i18n';
import styles from './LanguageSwitch.module.css';

type Props = {
  locale: Locale;
  labels: Messages['lang'];
  // section to keep when switching, e.g. "speisekarte"
  sectionId: string;
};

export default function LanguageSwitch({ locale, labels, sectionId }: Props) {
  const router = useRouter();

  const choose = (next: Locale) => {
    if (next === locale) return;
    try {
      localStorage.setItem(storageKey, next);
    } catch {}
    router.push(`/${next}${sectionId && sectionId !== 'start' ? `#${sectionId}` : ''}`);
  };

  return (
    <div className={styles.pill} role="group" aria-label={labels.label} data-locale={locale}>
      <span className={styles.thumb} aria-hidden="true" />
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          className={styles.option}
          aria-pressed={l === locale}
          lang={l}
          onClick={() => choose(l)}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
