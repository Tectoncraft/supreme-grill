Project overview

Demo front-end website for Supreme Grill, a döner / grill restaurant in Landstuhl, Germany. Front end only: no database, no backend. All content lives in local data files. German is the default language, English is the second language.

Built by fabos.business (Instagram: https://instagram.com/fabos.business). Credit appears in the footer.

Business facts (always use these exact values)
Name: Supreme Grill (since 2022 / "Seit 2022")
Address: Torfstraße 8, 66849 Landstuhl, Deutschland
Phone: +49 176 61400826 → link as tel:+4917661400826
Opening hours: Monday–Saturday 11:00–20:00, Sunday closed. Timezone Europe/Berlin.
Special: "Dönerstag" – every Thursday every Döner costs 5,00 € / mit Käse 5,50 €

Never invent other facts (email, owner name, delivery, prices). If something is missing, leave a clearly marked TODO placeholder.

Tech stack
Next.js (App Router) + TypeScript, static export (output: 'export' in next.config) so it can be hosted anywhere
Styling: CSS Modules + global CSS custom properties (no Tailwind unless I ask)
GSAP + ScrollTrigger via @gsap/react (useGSAP hook) for scroll animations
3D: React Three Fiber (@react-three/fiber + @react-three/drei) only where real 3D is needed; prefer CSS 3D transforms (tilt, perspective) for cards
Images through next/image with unoptimized: true (required for static export)
Fonts through next/font (self-hosted, no Google requests → GDPR friendly)
No backend, no database, no API routes, no external analytics.
Next.js rules
Server Components by default. Add 'use client' only to components that need state, effects, browser APIs, GSAP or Three.js (navbar, hero scroll story, language switch, open badge, pizza builder, gallery lightbox, cookie banner, admin dashboard).
Never touch window, document or localStorage during render; only inside useEffect / event handlers. Avoid hydration mismatches: time-based UI (open badge, Dönerstag countdown) renders a neutral state on the server and fills in after mount.
Three.js / R3F components are loaded with next/dynamic and ssr: false.
Register GSAP plugins once in a client-side lib/gsap.ts.
Use next/link for internal links and metadata exports for SEO.
Brand & design
Colors (define as CSS variables in :root):
--green: #2EE52E (logo "SUPREME")
--orange: #FF7A00 (logo "GRILL", main call-to-action buttons)
--bg: #0f0f0f (page background)
--slate: #1a1b1d (menu section background; must match the last frame of the hero video – will be updated)
--text: #f5f5f5, --muted: #a0a0a0
Dark, cinematic, warm "grill" mood. Green and orange used as accents, not large fills.
Logo: round white badge with green "SUPREME" and orange "GRILL" → /public/assets/logo.png
Headings: bold, wide letter-spacing (matches the printed menu style). Body: clean sans-serif.
Mobile first. Most visitors will be on phones.
Respect prefers-reduced-motion everywhere.
Page structure (one-page site + legal pages)
Navbar – fixed; transparent over hero, dark glass after 80px scroll; hides on scroll down, shows on scroll up. Links: Start · Speisekarte · Über uns · Galerie · Bewertungen · FAQ · Blog · Kontakt. Right side: live open/closed badge, DE|EN switch, orange "Anrufen" button. Mobile: burger → full-screen overlay + sticky bottom bar (Anrufen · Route · Speisekarte).
Hero → Menu scroll story – see section below.
Speisekarte (Menu) – category tabs, veggie filter, 3D tilt cards with images, Dönerstag banner, pizza builder.
Über uns – description, "Seit 2022", photo/video.
Galerie – image grid with lightbox.
Bewertungen – top 5-star reviews, star rating display.
FAQ – accordion.
Blog / Artikel – article cards + article detail view.
Kontakt / Standort – address, hours table, phone, "Route planen" link, map (behind consent).
Footer – logo, quick links, Impressum, Datenschutz, Cookie-Einstellungen, credit to fabos.business.

Separate pages: /impressum, /datenschutz, /admin (demo dashboard).

Hero → Menu scroll story (most important part)
One section ~400vh tall with a sticky full-screen <video> (/public/assets/hero-story.mp4, muted, playsinline, poster image).
GSAP ScrollTrigger scrub: 0.5 maps scroll progress 0→1 to video.currentTime.
The video is one continuous camera move: döner spit → knife slices meat → slices land on a plate → top-down view on dark slate, food on the right third, left side empty.
Overlay A (hero text, logo, buttons "Speisekarte" / "Route"): visible 0–0.35, fades out and moves up by 0.5.
Overlay B (menu intro: "Unsere Speisekarte", tagline, category tabs) on the left half: fades in 0.75–0.95.
The next section uses --slate as background so there is no visible edge when the video unpins. No hard borders, no scroll snapping.
All timings live in one config object (config/scrollStory.ts) so they can be tuned.
Until the real video exists, use a placeholder (dark animated gradient) but keep the same file name and code path.
Mobile + reduced motion: no scrubbing; autoplaying muted loop with hero text, then a normal menu section.
If scrubbing stutters on iOS Safari, switch to a WebP frame sequence drawn on <canvas>.
Video must be encoded with every frame a keyframe: ffmpeg -i in.mp4 -c:v libx264 -g 1 -crf 22 -pix_fmt yuv420p -an -movflags +faststart hero-story.mp4
Internationalization (DE default, EN)
All visible text comes from messages/de.json and messages/en.json. No hard-coded strings in components.
Locale routing with app/[locale]/: German at /de (root / redirects to /de), English at /en. Use generateStaticParams for both locales so the static export works.
The DE|EN switch keeps the same page and section (/de#speisekarte → /en#speisekarte) and saves the choice in localStorage (try/catch).
<html lang> matches the locale. Add alternates.languages (hreflang) in metadata.
Menu dish names stay German in both languages (Döner, Pommes, etc.); descriptions are translated.
Prices are always formatted German style: 6,50 €.
Menu data (source of truth: data/menu.ts)

Prices must match exactly. Do not change or invent items.

Kebab (Hähnchenfleisch)

Normal / mit Käse – 6,00 / 6,50 – Dönerfleisch, Salat nach eigener Wahl, Dressing
Kebab Bowl – 8,50 – Dönerfleisch, Pommes, Salat
Vegetarisch – 5,00

Pizza – Do it yourself

Basis: Tomatensauce, Käse – 8,00 – bis zu 3 Zutaten inklusive, jede weitere Zutat +0,50 €
Zutaten: Salami, Peperoniwurst, Sucuk, Dönerfleisch (+1,00 € Aufpreis), Schinken, Mozzarella, Paprika, Rucola, Champignons, Peperoni, Zwiebeln, Jalapeños, Dönersauce, Oliven

Fingerfood

Portion Pommes – 3,00 – mit Mayonnaise oder Ketchup
Tender 6er – 7,50 – Filetstücke mit hausgemachter Panade
Wings 9er / 12er – 10,00 / 12,00 – Hähnchenflügel mit hausgemachter Panade

Bowls

Classic Salad – 5,00 – Grünsalat mit Kraut, Tomaten, Gurken, Zwiebeln & Dressing
Chicken Salad – 7,00 – Grünsalat mit Tomaten, Gurken, Zwiebeln, Tenderstreifen & Dressing
Bauern Salad – 7,00 – Frische Tomaten, Gurken, Oliven, Zwiebeln & Schafskäse

Veggie

Falafel 6er / 9er – 4,50 / 6,00 – frittierte Bällchen aus Kichererbsen & Gewürzen
Falafel Bowl – 7,00 – Salat mit Falafeln & Dressing
Falafel Sandwich – 6,00 – Falafel im Brot mit Salat nach eigener Wahl & Dressing
Vegetarischer Kebab – 5,00

Getränke (Pfand im Preis inbegriffen)

Softdrinks – 2,15 – Cola, Cola Zero, Sprite, Fanta, Uludağ
Capri-Sun – 1,00
Ayran – 1,50
Wasser (still) – 1,50

Dips

Döner-Dip – 1,00
Barbeque-Dip – 1,00
Tomatensauce-Dip – 1,00
Ketchup / Mayonnaise – 0,30

Menüs

Kindermenü – 6,50 – 4 Wings, kleine Pommes & Getränk
Kebabmenü – 7,00 – Döner und Getränk
Schüler- & Studentenmenü – 6,00 – Döner und Getränk
Doppel D / mit Käse – 11,00 / 12,00 – 2 Döner
Combi-Box – 12,00 – 6 Wings + 4 Tender

Dönerstag – donnerstags jeder Döner 5,00 / 5,50

Allergen and additive codes: TODO – waiting for a readable photo of the legend. Keep a field allergens: [] on every item, empty for now, and an "Allergene & Zusatzstoffe" info button that shows a placeholder.

Pizza builder: user picks toppings, price = 8,00 + 0,50 × (toppings beyond 3) + 1,00 if Dönerfleisch. Show live total.

Features
Open/closed badge: "Jetzt geöffnet · bis 20:00" / "Geschlossen · öffnet [Tag] 11:00", computed in Europe/Berlin time, refreshes every minute.
Dönerstag banner: on Thursdays "Heute ist Dönerstag!", otherwise "Noch X Tage bis Dönerstag".
Reviews: stored in data/reviews.ts. Use only real reviews supplied by the owner. Until then, show clearly labeled sample reviews (isSample: true → small "Beispiel" tag). Never present invented reviews as real customers.
FAQ: accessible accordion (button + aria-expanded). Topics: Öffnungszeiten, vegetarische Optionen, Dönerstag, Kartenzahlung (TODO – confirm), Parken (TODO), Allergene, Bestellung zum Mitnehmen.
Blog: articles in data/articles.ts (title, slug, date, excerpt, body, image, DE + EN).
Gallery: images from /public/assets/gallery/, lazy-loaded, lightbox with keyboard + swipe.
Cookies & legal (Germany / GDPR)
Cookie banner on first visit: "Alle akzeptieren", "Nur notwendige", "Einstellungen". Equal visual weight for accept and reject.
Nothing non-essential loads before consent. Google Maps embed loads only after consent (show a placeholder with "Karte laden" button until then).
Footer link "Cookie-Einstellungen" reopens the banner.
/impressum and /datenschutz pages with TODO placeholders for owner name, email and legal details. Do not invent legal data.
Admin dashboard (demo only)
Route /admin, linked discreetly in the footer.
Shows: current domain (window.location.hostname), visitor count, visitors per day chart (last 14 days), top pages, device split, language split, top menu categories viewed.
Data is simulated in data/adminDemo.ts plus local visit counting in localStorage for this browser. Show a visible note: "Demo-Daten – keine echte Analyse".
No real tracking, no login backend. Optional fake password gate is fine but label it as demo.
SEO
German <title> and meta description, Open Graph tags, favicon from the logo.
JSON-LD Restaurant schema: name, address, phone, opening hours, servesCuisine, priceRange "€".
Folder structure
/public/assets/                 logo.png, hero-story.mp4, hero-poster.webp, gallery/, menu/
/app/[locale]/page.tsx          one-page site (all sections)
/app/[locale]/impressum/        Impressum
/app/[locale]/datenschutz/      Datenschutz
/app/[locale]/blog/[slug]/      article detail
/app/admin/                     demo dashboard (German only is fine)
/app/globals.css                CSS variables, base styles
/components/                    Navbar, HeroScrollStory, Menu, PizzaBuilder, Gallery,
                                Reviews, Faq, Blog, Contact, Footer, CookieBanner,
                                OpenBadge, LanguageSwitch (each with its .module.css)
/config/site.ts                 business facts
/config/scrollStory.ts          hero video timings
/data/                          menu.ts, reviews.ts, articles.ts, faq.ts, adminDemo.ts
/messages/                      de.json, en.json
/lib/                           gsap.ts, i18n.ts, hours.ts (open/closed + Dönerstag logic), price.ts
Coding rules
Business facts only from config/site.ts; menu only from data/menu.ts. Never duplicate them in markup.
Semantic HTML, keyboard accessible, visible focus states, alt text on all images.
Images: WebP/AVIF, lazy-loaded below the fold, explicit width/height.
Animations use transform and opacity only. Target 60fps on mid-range phones.
Test at 375px, 768px, 1440px. No horizontal scroll.
Keep components small; no file over ~300 lines.
Run npm run build after big changes and fix any errors.