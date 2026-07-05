import { useCallback, useEffect, useRef, useState } from "react";
import { getCartCount, readCart } from "../utils/cartStorage";

/**
 * Subscribe to cart changes for header badge and cart page.
 * @returns {{
 *   items: import('../types').CartLineItem[],
 *   count: number,
 *   countIncreased: boolean,
 *   refresh: () => void
 * }}
 */
export function useCart() {
  const [items, setItems] = useState(() => readCart());
  const [count, setCount] = useState(() => getCartCount());
  const [countIncreased, setCountIncreased] = useState(false);
  const prevCountRef = useRef(getCartCount());

  const refresh = useCallback(() => {
    const next = readCart();
    const nextCount = getCartCount();
    setItems(next);
    setCount(nextCount);

    if (nextCount > prevCountRef.current) {
      setCountIncreased(true);
    }
    prevCountRef.current = nextCount;
  }, []);

  useEffect(() => {
    if (!countIncreased) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCountIncreased(false), 400);
    return () => window.clearTimeout(timer);
  }, [countIncreased]);

  useEffect(() => {
    const handleChange = () => refresh();

    window.addEventListener("mashood-cart-changed", handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("mashood-cart-changed", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [refresh]);

  return { items, count, countIncreased, refresh };
}
