export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  /** Variants of the product (layout, size…), displayed as sub-rows. */
  variants?: Product[];
}

export const products: Product[] = [
  {
    id: "keyboard",
    name: "Mechanical keyboard",
    description: "Tactile switches, aluminium frame.",
    price: 129,
    inStock: true,
    variants: [
      { id: "keyboard-azerty", name: "Mechanical keyboard — AZERTY", description: "French layout.", price: 129, inStock: true },
      { id: "keyboard-qwerty", name: "Mechanical keyboard — QWERTY", description: "US layout.", price: 129, inStock: false },
    ],
  },
  { id: "mouse", name: "Wireless mouse", description: "Ergonomic, 70 days of battery.", price: 59, inStock: true },
  {
    id: "monitor",
    name: "27\" 4K monitor",
    description: "IPS panel, USB-C 90W.",
    price: 449,
    inStock: false,
    variants: [
      { id: "monitor-matte", name: "27\" 4K monitor — Matte", description: "Anti-glare coating.", price: 449, inStock: false },
      { id: "monitor-glossy", name: "27\" 4K monitor — Glossy", description: "Vivid colours.", price: 469, inStock: false },
    ],
  },
];

/** Finds a product or one of its variants by id. */
export function findProduct(id: string | undefined, list: Product[] = products): Product | undefined {
  for (const product of list) {
    if (product.id === id) return product;
    const variant = product.variants && findProduct(id, product.variants);
    if (variant) return variant;
  }
  return undefined;
}
