import type { Pizza } from '@/data/menu';

// German style: 6,50 € (non-breaking space before the euro sign)
export const formatPrice = (value: number) => `${value.toFixed(2).replace('.', ',')} €`;

export type PizzaQuote = {
  count: number;
  extraCount: number;
  extraCost: number;
  meatCost: number;
  total: number;
};

// base + extra × (toppings beyond the included ones) + surcharges (Dönerfleisch)
export function pizzaQuote(pizza: Pizza, selectedIds: string[]): PizzaQuote {
  const selected = pizza.toppings.filter((t) => selectedIds.includes(t.id));
  const extraCount = Math.max(0, selected.length - pizza.included);
  const extraCost = extraCount * pizza.extra;
  const meatCost = selected.reduce((sum, t) => sum + (t.surcharge ?? 0), 0);
  // round to cents to avoid float drift
  const total = Math.round((pizza.base + extraCost + meatCost) * 100) / 100;
  return { count: selected.length, extraCount, extraCost, meatCost, total };
}
