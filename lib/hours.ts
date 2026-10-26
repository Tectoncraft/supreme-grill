import { site } from '@/config/site';

export type OpenState =
  | { open: true; closesAt: string }
  | { open: false; nextDay: number; opensAt: string };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const berlinParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    day: WEEKDAYS.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function getOpenState(date: Date = new Date()): OpenState {
  const { day, minutes } = berlinParts(date);
  const today = site.hours[day];
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, closesAt: today.close };
  }
  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7;
    const h = site.hours[d];
    if (h && (offset > 0 || minutes < toMinutes(h.open))) {
      return { open: false, nextDay: d, opensAt: h.open };
    }
  }
  return { open: false, nextDay: 1, opensAt: '11:00' };
}

// JS weekday (0 = Sunday) in Europe/Berlin
export const getBerlinDay = (date: Date = new Date()) => berlinParts(date).day;

const THURSDAY = 4;

export function getDoenerstag(date: Date = new Date()) {
  const day = getBerlinDay(date);
  const daysUntil = (THURSDAY - day + 7) % 7;
  return { isToday: daysUntil === 0, daysUntil };
}
