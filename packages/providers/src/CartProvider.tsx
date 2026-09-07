import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CartContext, useBusinessContext, type CartContextValue, type CartItem } from '@rdplatforms/contexts';
import { readCart, writeCart } from './cartStorage';

/**
 * Only apps/website wires this in (AppProviders does not include it by
 * default — see AppProviders' own comment) since only it has a shop.
 * Must render inside a BusinessProvider: it reads useBusinessContext()
 * to namespace the cart's localStorage key per business.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { business } = useBusinessContext();
  const businessId = business?.id ?? '';
  const [items, setItems] = useState<CartItem[]>(() => (businessId ? readCart(businessId) : []));

  const persist = useCallback(
    (next: CartItem[]) => {
      setItems(next);
      if (businessId) {
        writeCart(businessId, next);
      }
    },
    [businessId],
  );

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        const next = existing
          ? prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i))
          : [...prev, { ...item, quantity }];
        if (businessId) {
          writeCart(businessId, next);
        }
        return next;
      });
    },
    [businessId],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        if (businessId) {
          writeCart(businessId, next);
        }
        return next;
      });
    },
    [businessId],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i));
        if (businessId) {
          writeCart(businessId, next);
        }
        return next;
      });
    },
    [businessId],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, addItem, removeItem, setQuantity, clear }),
    [items, itemCount, subtotal, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
