// Source of truth for the menu. Dish names stay German in both languages;
// descriptions live in messages/*.json under menu.items[id].
// `image`: file name inside /public/assets/menu/ (null = placeholder tile).
// Current photos are free stock images (Pexels) chosen to match each dish; swap in real photos by keeping the file name.
// `allergens`: TODO – waiting for a readable photo of the legend.

export type VariantId = 'normal' | 'cheese' | '6er' | '9er' | '12er';
export type CategoryId =
  | 'kebab'
  | 'pizza'
  | 'fingerfood'
  | 'bowls'
  | 'veggie'
  | 'drinks'
  | 'dips'
  | 'menus';

export type MenuItem = {
  id: string;
  name: string;
  category: CategoryId;
  price?: number;
  variants?: { id: VariantId; price: number }[];
  veggie: boolean;
  image: string | null;
  allergens: string[];
};

export type Topping = { id: string; name: string; veggie: boolean; surcharge?: number };

export type Pizza = {
  name: string;
  base: number;
  included: number;
  extra: number;
  image: string | null;
  toppings: Topping[];
};

export const categories: { id: CategoryId }[] = [
  { id: 'kebab' },
  { id: 'pizza' },
  { id: 'fingerfood' },
  { id: 'bowls' },
  { id: 'veggie' },
  { id: 'drinks' },
  { id: 'dips' },
  { id: 'menus' },
];

const item = (
  id: string,
  name: string,
  category: CategoryId,
  veggie: boolean,
  pricing: { price: number } | { variants: { id: VariantId; price: number }[] },
): MenuItem => ({ id, name, category, veggie, image: `${id}.webp`, allergens: [], ...pricing });

export const menuItems: MenuItem[] = [
  // Kebab (Hähnchenfleisch)
  item('kebab', 'Kebab', 'kebab', false, {
    variants: [
      { id: 'normal', price: 6.0 },
      { id: 'cheese', price: 6.5 },
    ],
  }),
  item('kebab-bowl', 'Kebab Bowl', 'kebab', false, { price: 8.5 }),
  item('kebab-vegetarisch', 'Vegetarisch', 'kebab', true, { price: 5.0 }),

  // Fingerfood
  item('pommes', 'Portion Pommes', 'fingerfood', true, { price: 3.0 }),
  item('tender', 'Tender 6er', 'fingerfood', false, { price: 7.5 }),
  item('wings', 'Wings', 'fingerfood', false, {
    variants: [
      { id: '9er', price: 10.0 },
      { id: '12er', price: 12.0 },
    ],
  }),

  // Bowls
  item('classic-salad', 'Classic Salad', 'bowls', true, { price: 5.0 }),
  item('chicken-salad', 'Chicken Salad', 'bowls', false, { price: 7.0 }),
  item('bauern-salad', 'Bauern Salad', 'bowls', true, { price: 7.0 }),

  // Veggie
  item('falafel', 'Falafel', 'veggie', true, {
    variants: [
      { id: '6er', price: 4.5 },
      { id: '9er', price: 6.0 },
    ],
  }),
  item('falafel-bowl', 'Falafel Bowl', 'veggie', true, { price: 7.0 }),
  item('falafel-sandwich', 'Falafel Sandwich', 'veggie', true, { price: 6.0 }),
  item('vegetarischer-kebab', 'Vegetarischer Kebab', 'veggie', true, { price: 5.0 }),

  // Getränke (Pfand im Preis inbegriffen)
  item('softdrinks', 'Softdrinks', 'drinks', true, { price: 2.15 }),
  item('capri-sun', 'Capri-Sun', 'drinks', true, { price: 1.0 }),
  item('ayran', 'Ayran', 'drinks', true, { price: 1.5 }),
  item('wasser', 'Wasser (still)', 'drinks', true, { price: 1.5 }),

  // Dips
  item('doener-dip', 'Döner-Dip', 'dips', false, { price: 1.0 }),
  item('barbeque-dip', 'Barbeque-Dip', 'dips', false, { price: 1.0 }),
  item('tomatensauce-dip', 'Tomatensauce-Dip', 'dips', true, { price: 1.0 }),
  item('ketchup-mayo', 'Ketchup / Mayonnaise', 'dips', true, { price: 0.3 }),

  // Menüs
  item('kindermenue', 'Kindermenü', 'menus', false, { price: 6.5 }),
  item('kebabmenue', 'Kebabmenü', 'menus', false, { price: 7.0 }),
  item('schueler-studenten', 'Schüler- & Studentenmenü', 'menus', false, { price: 6.0 }),
  item('doppel-d', 'Doppel D', 'menus', false, {
    variants: [
      { id: 'normal', price: 11.0 },
      { id: 'cheese', price: 12.0 },
    ],
  }),
  item('combi-box', 'Combi-Box', 'menus', false, { price: 12.0 }),
];

export const pizza: Pizza = {
  name: 'Pizza – Do it yourself',
  base: 8.0,
  included: 3,
  extra: 0.5,
  image: 'pizza.webp',
  toppings: [
    { id: 'salami', name: 'Salami', veggie: false },
    { id: 'peperoniwurst', name: 'Peperoniwurst', veggie: false },
    { id: 'sucuk', name: 'Sucuk', veggie: false },
    { id: 'doenerfleisch', name: 'Dönerfleisch', veggie: false, surcharge: 1.0 },
    { id: 'schinken', name: 'Schinken', veggie: false },
    { id: 'mozzarella', name: 'Mozzarella', veggie: true },
    { id: 'paprika', name: 'Paprika', veggie: true },
    { id: 'rucola', name: 'Rucola', veggie: true },
    { id: 'champignons', name: 'Champignons', veggie: true },
    { id: 'peperoni', name: 'Peperoni', veggie: true },
    { id: 'zwiebeln', name: 'Zwiebeln', veggie: true },
    { id: 'jalapenos', name: 'Jalapeños', veggie: true },
    { id: 'doenersauce', name: 'Dönersauce', veggie: true },
    { id: 'oliven', name: 'Oliven', veggie: true },
  ],
};

export const doenerstag = { price: 5.0, cheesePrice: 5.5 };
