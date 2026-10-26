import { CupSoda, Drumstick, Droplet, Leaf, Pizza, Salad, Sandwich, UtensilsCrossed } from 'lucide-react';
import type { CategoryId } from '@/data/menu';

export const categoryIcons = {
  kebab: Sandwich,
  pizza: Pizza,
  fingerfood: Drumstick,
  bowls: Salad,
  veggie: Leaf,
  drinks: CupSoda,
  dips: Droplet,
  menus: UtensilsCrossed,
} satisfies Record<CategoryId, unknown>;
