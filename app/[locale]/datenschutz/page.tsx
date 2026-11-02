import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getMessages, isLocale } from '@/lib/i18n';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { legal } = getMessages(locale);
  return <LegalPage locale={locale} block={legal.datenschutz} legal={legal} />;
}
