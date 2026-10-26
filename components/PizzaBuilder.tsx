'use client';

import Image from 'next/image';
import { useState } from 'react';
import { pizza } from '@/data/menu';
import { fmt, type Messages } from '@/lib/i18n';
import { formatPrice, pizzaQuote } from '@/lib/price';
import styles from './PizzaBuilder.module.css';

type Props = { text: Messages['menu']['pizza']; veggieOnly: boolean };

export default function PizzaBuilder({ text: t, veggieOnly }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const toppings = pizza.toppings.filter((x) => !veggieOnly || x.veggie);
  // meat toppings hidden by the filter must not stay in the price
  const active = selected.filter((id) => toppings.some((x) => x.id === id));
  const quote = pizzaQuote(pizza, active);

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const picked =
    quote.extraCount > 0
      ? fmt(t.pickedOver, { n: quote.count, over: quote.extraCount })
      : fmt(t.picked, { n: quote.count, included: pizza.included });

  return (
    <div className={styles.builder}>
      <div className={styles.info}>
        {pizza.image && (
          <Image
            src={`/assets/menu/${pizza.image}`}
            alt={pizza.name}
            width={640}
            height={480}
            loading="lazy"
            className={styles.photo}
          />
        )}
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h4 className={styles.title}>{t.title}</h4>
        <p className={styles.lead}>{t.lead}</p>
        <p className={styles.rule}>
          {fmt(t.rule, {
            included: pizza.included,
            extra: formatPrice(pizza.extra),
            meat: formatPrice(1),
          })}
        </p>
      </div>

      <fieldset className={styles.toppings}>
        <legend className={styles.legend}>{t.toppings}</legend>
        <ul className={styles.chips}>
          {toppings.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                className={styles.chip}
                aria-pressed={active.includes(x.id)}
                onClick={() => toggle(x.id)}
              >
                {x.name}
                {x.surcharge ? <span className={styles.plus}>+{formatPrice(x.surcharge)}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className={styles.total}>
        <dl className={styles.lines}>
          <div>
            <dt>{t.base}</dt>
            <dd>{formatPrice(pizza.base)}</dd>
          </div>
          {quote.extraCount > 0 && (
            <div>
              <dt>{t.extras}</dt>
              <dd>+{formatPrice(quote.extraCost)}</dd>
            </div>
          )}
          {quote.meatCost > 0 && (
            <div>
              <dt>{t.meat}</dt>
              <dd>+{formatPrice(quote.meatCost)}</dd>
            </div>
          )}
        </dl>
        <p className={styles.picked}>{picked}</p>
        <p className={styles.sum} aria-live="polite">
          <span className={styles.sumLabel}>{t.total}</span>
          {formatPrice(quote.total)}
        </p>
        <button type="button" className={styles.reset} onClick={() => setSelected([])} disabled={!active.length}>
          {t.reset}
        </button>
      </div>
    </div>
  );
}
