import de from '@/messages/de.json';
import en from '@/messages/en.json';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';
export const storageKey = 'sg-locale';

export type Messages = typeof de;

const all: Record<Locale, Messages> = { de, en };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const getMessages = (locale: Locale): Messages => all[locale];

export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
