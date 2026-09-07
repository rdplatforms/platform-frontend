import { createContext, useContext } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  category?: string;
  imageUrl?: string;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

/** Throws outside a <CartProvider> — for apps/website's own cart/checkout pages, which only render inside one. */
export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return value;
}

/**
 * Non-throwing — for shared components (e.g. @rdplatforms/ui's Shop
 * section) that render under SectionRenderer, which any app can use.
 * Not every app wraps its tree in a CartProvider (apps/portal/admin
 * never will), so those components must degrade gracefully rather than
 * assume one exists.
 */
export function useOptionalCart(): CartContextValue | undefined {
  return useContext(CartContext);
}
