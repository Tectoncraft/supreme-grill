import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMessages, isLocale } from '@/lib/i18n';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { legal } = getMessages(locale);

  return (
    <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '7rem 1.25rem 4rem' }}>
      <h1>{legal.impressumTitle}</h1>
      <p>{legal.todo}</p>
      <p>
        <Link href={`/${locale}/`}>{legal.back}</Link>
      </p>
    </main>
  );
}
