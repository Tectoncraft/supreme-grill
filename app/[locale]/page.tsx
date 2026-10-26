import HeroScrollStory from '@/components/HeroScrollStory';
import Footer from '@/components/Footer';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import SmoothAnchors from '@/components/SmoothAnchors';
import SmoothScroll from '@/components/SmoothScroll';
import { getMessages, isLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <>
      <SmoothScroll />
      <SmoothAnchors />
      <Navbar locale={locale} nav={m.nav} badge={m.badge} days={m.days} lang={m.lang} />
      <main>
        <HeroScrollStory hero={m.hero} intro={m.menuIntro} />
        <Menu menu={m.menu} />
      </main>
      <Footer locale={locale} footer={m.footer} nav={m.nav} lang={m.lang} daysLong={m.daysLong} />
    </>
  );
}
