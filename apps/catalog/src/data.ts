export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
}

export const products: Product[] = [
  { id: "keyboard", name: "Mechanical keyboard", description: "Tactile switches, aluminium frame.", price: 129, inStock: true },
  { id: "mouse", name: "Wireless mouse", description: "Ergonomic, 70 days of battery.", price: 59, inStock: true },
  { id: "monitor", name: "27\" 4K monitor", description: "IPS panel, USB-C 90W.", price: 449, inStock: false },
];
