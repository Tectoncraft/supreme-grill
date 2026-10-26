'use client';

import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { activeNavSections, routeUrl, site } from '@/config/site';
import { getBerlinDay } from '@/lib/hours';
import { fmt, type Locale, type Messages } from '@/lib/i18n';
import LanguageSwitch from './LanguageSwitch';
import styles from './Footer.module.css';

type Props = {
  locale: Locale;
  footer: Messages['footer'];
  nav: Messages['nav'];
  lang: Messages['lang'];
  daysLong: Messages['daysLong'];
};

// Monday first, like the printed hours
const WEEK = [1, 2, 3, 4, 5, 6, 0];

export default function Footer({ locale, footer: f, nav, lang, daysLong }: Props) {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setToday(getBerlinDay());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Image src="/assets/logo.svg" alt="Supreme Grill" width={88} height={88} loading="lazy" />
            <p className={styles.tagline}>{fmt(f.tagline, { year: site.since, city: site.city })}</p>
          </div>

          <div>
            <h2 className={styles.heading}>{f.address}</h2>
            <address className={styles.address}>
              <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>
                {site.street}
                <br />
                {site.zip} {site.city}
              </span>
            </address>
            <a href={routeUrl} className={styles.textLink} target="_blank" rel="noopener noreferrer">
              {f.route}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <h2 className={`${styles.heading} ${styles.gap}`}>{f.phone}</h2>
            <a href={site.phoneHref} className={styles.phone}>
              <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
              {site.phone}
            </a>
          </div>

          <div>
            <h2 className={styles.heading}>{f.hours}</h2>
            <table className={styles.hours}>
              <tbody>
                {WEEK.map((d) => {
                  const h = site.hours[d];
                  return (
                    <tr key={d} data-today={today === d} aria-current={today === d ? 'date' : undefined}>
                      <th scope="row">{daysLong[d]}</th>
                      <td>{h ? `${h.open} – ${h.close}` : f.closed}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <nav aria-label={f.links}>
            <h2 className={styles.heading}>{f.links}</h2>
            <ul className={styles.links}>
              {activeNavSections.map(({ id, key }) => (
                <li key={id}>
                  <a href={`/${locale}/#${id}`}>{nav[key]}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy} suppressHydrationWarning>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className={styles.legal}>
            <li>
              <Link href={`/${locale}/impressum/`}>{f.impressum}</Link>
            </li>
            <li>
              <Link href={`/${locale}/datenschutz/`}>{f.datenschutz}</Link>
            </li>
            <li>
              {/* TODO: reopen the cookie banner once it exists */}
              <button type="button" className={styles.linkButton}>
                {f.cookies}
              </button>
            </li>
          </ul>
          <LanguageSwitch locale={locale} labels={lang} sectionId="footer" />
          <p className={styles.credit}>
            {f.credit}{' '}
            <a href={site.credit.url} target="_blank" rel="noopener noreferrer">
              {site.credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
