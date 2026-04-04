import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./Authcontext";
import {
  getUserCart,
  saveUserCart,
  getUserWishlist,
  saveUserWishlist,
} from "@/utils/api";

const API_BASE = import.meta.env.VITE_API_URL || "https://backend-wghd.onrender.com/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  mood?: "happy" | "sad" | "romantic" | "angry";
  collection?: "noor" | "zara" | "rune" | "amara" | "viella" | "quotes";
  burnTime: string;
  fragrance?: string;
  isBestSeller?: boolean;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  customizations?: Array<{
    id?: string;
    type?: string;
    name?: string;
    price?: number;
    message?: string;
    playlist?: string;
  }>;
  customizationsTotal?: number;
  selectedFragrance?: string;
}

interface StoreContextType {
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, customPrice?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const getCartKey = (userId?: string | null) =>
    userId ? `candlesngiggles-cart-${userId}` : `candlesngiggles-cart`;

  const getWishlistKey = (userId?: string | null) =>
    userId ? `candlesngiggles-wishlist-${userId}` : `candlesngiggles-wishlist`;

  const prevUserRef = useRef<typeof user | null>(null);
  const [isServerSynced, setIsServerSynced] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const guestCart = localStorage.getItem("candlesngiggles-cart");
      const userCart = user
        ? localStorage.getItem(`candlesngiggles-cart-${user.id}`)
        : null;

      if (userCart) return JSON.parse(userCart);
      if (guestCart) return JSON.parse(guestCart);

      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const key = getCartKey(user?.id ?? null);
      const saved = localStorage.getItem(key);

      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {}
  }, [user]);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const key = getWishlistKey(null);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(
          `candlesngiggles-cart-${user.id}`,
          JSON.stringify(cart),
        );
      } else {
        localStorage.setItem("candlesngiggles-cart", JSON.stringify(cart));
      }
    } catch {}
  }, [cart, user]);

  useEffect(() => {
    try {
      const key = getWishlistKey(user?.id ?? null);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, user?.id]);

  const prevCartRef = useRef(cart);
  const prevWishlistRef = useRef(wishlist);

  useEffect(() => {
    if (!user || !token) return;

    if (cart === prevCartRef.current) return;
    prevCartRef.current = cart;

    (async () => {
      try {
        await saveUserCart(token, cart);
      } catch (e) {
        console.error("Failed to save cart to server", e);
      }
    })();
  }, [cart, user, token, isServerSynced]);

  useEffect(() => {
    if (!user || !token || !isServerSynced) return;

    if (wishlist === prevWishlistRef.current) return;
    prevWishlistRef.current = wishlist;

    (async () => {
      try {
        await saveUserWishlist(token, wishlist);
      } catch {}
    })();
  }, [wishlist, user, token, isServerSynced]);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    const currUser = user ?? null;

    (async () => {
      if (!prevUser && currUser) {
        setIsServerSynced(false);
        try {
          const guestKey = getCartKey(null);
          let guest: CartItem[] = [];
          try {
            guest = JSON.parse(localStorage.getItem(guestKey) || "[]");
          } catch {
            localStorage.removeItem(guestKey);
          }

          let serverCart: CartItem[] = [];
          try {
            if (token) {
              const res = await getUserCart(token);
              serverCart = res.cart || [];
            }
          } catch {
            serverCart = JSON.parse(
              localStorage.getItem(getCartKey(currUser.id)) || "[]",
            );
          }

          const merged = mergeCarts(serverCart, guest);
          setCart(merged);
          prevCartRef.current = merged;

          try {
            if (token) await saveUserCart(token, merged);
          } catch {}

          localStorage.setItem(getCartKey(currUser.id), JSON.stringify(merged));
          localStorage.removeItem(guestKey);
        } catch {}

        try {
          const guestW = JSON.parse(
            localStorage.getItem(getWishlistKey(null)) || "[]",
          );

          let serverW: Product[] = [];
          try {
            if (token) {
              const resW = await getUserWishlist(token);
              serverW = resW.wishlist || [];
            }
          } catch {
            serverW = JSON.parse(
              localStorage.getItem(getWishlistKey(currUser.id)) || "[]",
            );
          }

          const mergedW = mergeWishlist(serverW, guestW);
          setWishlist(mergedW);
          prevWishlistRef.current = mergedW;

          try {
            if (token) await saveUserWishlist(token, mergedW);
          } catch {}

          localStorage.setItem(
            getWishlistKey(currUser.id),
            JSON.stringify(mergedW),
          );
          localStorage.removeItem(getWishlistKey(null));
        } catch {}

        setIsServerSynced(true);
      }

      if (prevUser && !currUser) {
        setIsServerSynced(false);
        try {
          const globalKey = getCartKey(null);
          localStorage.setItem(globalKey, JSON.stringify([]));
          setCart([]);
        } catch {}

        try {
          const globalWKey = getWishlistKey(null);
          localStorage.setItem(globalWKey, JSON.stringify([]));
          setWishlist([]);
        } catch {}
      }
    })();

    prevUserRef.current = currUser;
  }, [user, token]);

  function mergeCarts(a: CartItem[], b: CartItem[]) {
    const map = new Map<string, CartItem>();
    (a || []).forEach((item) => map.set(item.id, { ...item }));
    (b || []).forEach((item) => {
      const existing = map.get(item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + item.quantity;
      } else {
        map.set(item.id, { ...item });
      }
    });
    return Array.from(map.values());
  }

  function mergeWishlist(a: Product[], b: Product[]) {
    const map = new Map<string, Product>();
    (a || []).forEach((p) => map.set(p.id, p));
    (b || []).forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }

  const addToCart = (product: Product, customPrice?: number) => {
    const liveProduct = products.find((p) => p.id === product.id);
    const currentStock = liveProduct?.stock ?? product.stock ?? 0;
    const existingQuantity = cart
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (currentStock <= 0 || existingQuantity >= currentStock) {
      return false;
    }

    setCart((prev) => {
      const priceToUse =
        typeof customPrice === "number" ? customPrice : product.price;

      const existing = prev.find(
        (item) => item.id === product.id && item.price === priceToUse,
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.price === priceToUse
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, stock: currentStock, price: priceToUse, quantity: 1 }];
    });

    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const liveProduct = products.find((p) => p.id === productId);
    const stock = liveProduct?.stock;
    const safeQuantity = typeof stock === "number" ? Math.min(quantity, stock) : quantity;

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: safeQuantity } : item,
      ),
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider
      value={{
        products,
        productsLoading,
        refreshProducts,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
