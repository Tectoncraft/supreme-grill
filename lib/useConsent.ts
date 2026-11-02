'use client';

import { useEffect, useState } from 'react';
import { CONSENT_CHANGED, readConsent, type Consent } from './consent';

// null until mounted / until the visitor has decided. Gate external embeds on `consent?.media`.
export function useConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  useEffect(() => {
    const update = () => setConsent(readConsent());
    update();
    window.addEventListener(CONSENT_CHANGED, update);
    return () => window.removeEventListener(CONSENT_CHANGED, update);
  }, []);
  return consent;
}
