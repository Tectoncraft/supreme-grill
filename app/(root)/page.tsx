'use client';

import { useEffect } from 'react';
import { defaultLocale, isLocale, storageKey } from '@/lib/i18n';

// Static export has no server redirect: "/" sends visitors to their saved (or default) locale.
export default function RootRedirect() {
  useEffect(() => {
    let target: string = defaultLocale;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && isLocale(saved)) target = saved;
    } catch {}
    window.location.replace(`/${target}${window.location.hash}`);
  }, []);

  return (
    <noscript>
      <meta httpEquiv="refresh" content={`0;url=/${defaultLocale}`} />
      <a href={`/${defaultLocale}`}>Supreme Grill</a>
    </noscript>
  );
}
