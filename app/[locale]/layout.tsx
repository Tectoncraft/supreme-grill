import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { body, heading } from '@/lib/fonts';
import { getMessages, isLocale, locales } from '@/lib/i18n';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getMessages(locale);
  return {
    title: meta.title,
    description: meta.description,
    icons: { icon: '/assets/logo.svg' },
    alternates: { languages: { de: '/de', en: '/en' } },
    openGraph: { title: meta.title, description: meta.description, locale },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${body.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  );
}
