import type { Metadata } from 'next';
import { body, heading } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = { title: 'Supreme Grill' };

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${body.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  );
}
