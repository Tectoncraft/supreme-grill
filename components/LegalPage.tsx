import Image from 'next/image';
import Link from 'next/link';
import { legal as legalValues, site } from '@/config/site';
import { fmt, type Locale, type Messages } from '@/lib/i18n';
import styles from './LegalPage.module.css';

type Block = Messages['legal']['impressum'];
type Props = { locale: Locale; block: Block; legal: Messages['legal'] };

// "[TODO: …]" markers are highlighted so missing owner data can't be overlooked
const withTodos = (text: string) =>
  text.split(/(\[TODO:[^\]]*\])/).map((part, i) =>
    part.startsWith('[TODO') ? (
      <mark key={i} className={styles.todo}>
        {part}
      </mark>
    ) : (
      part
    ),
  );

export default function LegalPage({ locale, block, legal }: Props) {
  const vars = {
    ...legalValues,
    name: site.name,
    street: site.street,
    zip: site.zip,
    city: site.city,
    country: site.country,
    phone: site.phone,
    credit: site.credit.name,
  };

  return (
    <>
      <header className={styles.bar}>
        <Link href={`/${locale}/`} aria-label={legal.back}>
          <Image src="/assets/logo.svg" alt="" width={44} height={44} />
        </Link>
        <Link href={`/${locale}/`} className={styles.back}>
          ← {legal.back}
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{block.title}</h1>
        <p className={styles.draft} role="note">
          {legal.draft}
        </p>
        {block.sections.map((s) => (
          <section key={s.h} className={styles.section}>
            <h2>{s.h}</h2>
            {s.p.map((line, i) => (
              <p key={i}>{withTodos(fmt(line, vars))}</p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
