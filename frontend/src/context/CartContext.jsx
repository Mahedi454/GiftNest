import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'giftnest_cart';
export const SHIPPING_FEE = 60;

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) return current.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      return [...current, { id: product.id, name: product.name, price: product.price, image: product.image, quantity }];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)));
  }, []);

  const remove = useCallback((id) => setItems((current) => current.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = items.length ? SHIPPING_FEE : 0;
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
