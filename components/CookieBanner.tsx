'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_OPEN, readConsent, saveConsent } from '@/lib/consent';
import type { Locale, Messages } from '@/lib/i18n';
import styles from './CookieBanner.module.css';

type Props = { locale: Locale; text: Messages['cookie'] };

export default function CookieBanner({ locale, text: t }: Props) {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [media, setMedia] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  // first visit (or expired / outdated choice): show the banner. Nothing optional is on by default.
  useEffect(() => {
    if (!readConsent()) setBannerOpen(true);
    const reopen = () => {
      setMedia(readConsent()?.media ?? false);
      setBannerOpen(false);
      dialog.current?.showModal();
    };
    window.addEventListener(CONSENT_OPEN, reopen);
    return () => window.removeEventListener(CONSENT_OPEN, reopen);
  }, []);

  const decide = (allowMedia: boolean) => {
    saveConsent(allowMedia);
    setBannerOpen(false);
    dialog.current?.close();
  };

  const openSettings = () => {
    setMedia(readConsent()?.media ?? false);
    dialog.current?.showModal();
  };

  return (
    <>
      {bannerOpen && (
        <section className={styles.banner} role="region" aria-label={t.region} aria-labelledby="cookie-title">
          <h2 id="cookie-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.text}>
            {t.text}{' '}
            <Link href={`/${locale}/datenschutz/`} className={styles.link}>
              {t.more}
            </Link>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => decide(true)}>
              {t.acceptAll}
            </button>
            <button type="button" className={styles.btn} onClick={() => decide(false)}>
              {t.necessaryOnly}
            </button>
            <button type="button" className={styles.btn} onClick={openSettings}>
              {t.settings}
            </button>
          </div>
        </section>
      )}

      <dialog ref={dialog} className={styles.dialog} aria-labelledby="cookie-settings-title" data-lenis-prevent>
        <div className={styles.inner}>
          <h2 id="cookie-settings-title" className={styles.title}>
            {t.settingsTitle}
          </h2>
          <p className={styles.text}>{t.settingsLead}</p>

          <div className={styles.row}>
            <div>
              <h3 className={styles.name}>{t.necessary.name}</h3>
              <p className={styles.desc}>{t.necessary.desc}</p>
            </div>
            <span className={styles.fixed}>{t.alwaysOn}</span>
          </div>

          <div className={styles.row}>
            <div>
              <h3 className={styles.name}>{t.media.name}</h3>
              <p className={styles.desc}>{t.media.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={media}
              aria-label={t.media.name}
              className={styles.switch}
              onClick={() => setMedia((m) => !m)}
            >
              <span className={styles.knob} />
            </button>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => decide(true)}>
              {t.acceptAll}
            </button>
            <button type="button" className={styles.btn} onClick={() => decide(false)}>
              {t.necessaryOnly}
            </button>
            <button type="button" className={styles.btn} onClick={() => decide(media)}>
              {t.save}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
