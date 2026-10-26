'use client';

import { Info, X } from 'lucide-react';
import { useRef } from 'react';
import type { Messages } from '@/lib/i18n';
import styles from './AllergenInfo.module.css';

export default function AllergenInfo({ text }: { text: Messages['menu']['allergens'] }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className={styles.button} onClick={() => dialog.current?.showModal()}>
        <Info size={16} strokeWidth={1.5} aria-hidden="true" />
        {text.button}
      </button>
      <dialog
        ref={dialog}
        data-lenis-prevent
        className={styles.dialog}
        aria-labelledby="allergen-title"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className={styles.inner}>
          <h3 id="allergen-title" className={styles.title}>
            {text.title}
          </h3>
          <p className={styles.todo}>{text.todo}</p>
          <button type="button" className={styles.close} onClick={() => dialog.current?.close()}>
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
            {text.close}
          </button>
        </div>
      </dialog>
    </>
  );
}
