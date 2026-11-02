// Cookie / local-storage consent. Stored in localStorage (never during render).
// "necessary" is always on; every optional category must default to off.
export type Consent = { v: number; media: boolean; ts: number };

const KEY = 'sg-consent';
const VERSION = 1; // bump when categories change to ask everyone again
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export const CONSENT_CHANGED = 'sg-consent-changed';
export const CONSENT_OPEN = 'sg-consent-open';

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== VERSION || typeof c.media !== 'boolean' || Date.now() - c.ts > MAX_AGE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(media: boolean): Consent {
  const c: Consent = { v: VERSION, media, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: c }));
  return c;
}

// footer link "Cookie-Einstellungen"
export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN));
