import Image from 'next/image';
import type { CategoryId } from '@/data/menu';
import { categoryIcons } from './categoryIcons';
import styles from './MenuImage.module.css';

type Props = { image: string | null; alt: string; category: CategoryId; soon: string };

// One placeholder style for every item until real photos land in /public/assets/menu/
export default function MenuImage({ image, alt, category, soon }: Props) {
  if (image) {
    return (
      <div className={styles.frame}>
        <Image src={`/assets/menu/${image}`} alt={alt} width={640} height={480} loading="lazy" className={styles.photo} />
      </div>
    );
  }
  const Icon = categoryIcons[category];
  return (
    <div className={`${styles.frame} ${styles.placeholder}`} role="img" aria-label={`${alt} – ${soon}`}>
      <Icon size={28} strokeWidth={1.25} aria-hidden="true" />
      <span className={styles.soon}>{soon}</span>
    </div>
  );
}
