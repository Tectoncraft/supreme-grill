export const site = {
  name: 'Supreme Grill',
  since: 2022,
  street: 'Torfstraße 8',
  zip: '66849',
  city: 'Landstuhl',
  country: 'Deutschland',
  phone: '+49 176 61400826',
  phoneHref: 'tel:+4917661400826',
  timezone: 'Europe/Berlin',
  // index = JS weekday (0 = Sunday); null = closed
  hours: [
    null,
    { open: '11:00', close: '20:00' },
    { open: '11:00', close: '20:00' },
    { open: '11:00', close: '20:00' },
    { open: '11:00', close: '20:00' },
    { open: '11:00', close: '20:00' },
    { open: '11:00', close: '20:00' },
  ] as ({ open: string; close: string } | null)[],
  credit: { name: 'fabos.business', url: 'https://instagram.com/fabos.business' },
} as const;

export const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.street}, ${site.zip} ${site.city}, ${site.country}`,
)}`;

// Flip `enabled` to true once a section exists; disabled links stay out of nav and footer.
export const navSections = [
  { id: 'start', key: 'start', enabled: true },
  { id: 'speisekarte', key: 'menu', enabled: true },
  { id: 'ueber-uns', key: 'about', enabled: false },
  { id: 'galerie', key: 'gallery', enabled: false },
  { id: 'bewertungen', key: 'reviews', enabled: false },
  { id: 'faq', key: 'faq', enabled: false },
  { id: 'blog', key: 'blog', enabled: false },
  { id: 'kontakt', key: 'contact', enabled: false },
] as const;

export const activeNavSections = navSections.filter((s) => s.enabled);

// Legal details the owner still has to supply. Never invent these; they render as marked TODOs.
export const legal = {
  owner: '[TODO: Name des Inhabers bzw. der Gesellschaft inkl. Rechtsform]',
  representative: '[TODO: Vertretungsberechtigte Person, falls abweichend]',
  email: '[TODO: E-Mail-Adresse]',
  vatId: '[TODO: USt-IdNr., falls vorhanden]',
  register: '[TODO: Handelsregister und Registernummer, falls vorhanden – sonst Abschnitt streichen]',
  dispute: '[TODO: Angabe zur Teilnahme an Verbraucherschlichtungsverfahren nach § 36 VSBG]',
  images: '[TODO: Bildnachweise ergänzen bzw. Platzhalterbilder durch eigene Fotos ersetzen]',
  hosting: '[TODO: Hosting-Anbieter inkl. Anschrift]',
  logs: '[TODO: Speicherdauer der Logfiles laut Hosting-Anbieter]',
  maps: '[TODO: Abschnitt prüfen/anpassen, sobald die Karte eingebunden ist]',
  authority:
    '[TODO: zuständige Aufsichtsbehörde bestätigen, voraussichtlich: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz]',
  date: '[TODO: Stand (Datum) eintragen]',
} as const;
