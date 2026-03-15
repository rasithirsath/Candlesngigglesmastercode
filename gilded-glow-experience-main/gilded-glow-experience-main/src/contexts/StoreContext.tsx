import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "./Authcontext";
import {
  getUserCart,
  saveUserCart,
  getUserWishlist,
  saveUserWishlist,
} from "@/utils/api";

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
  isBestSeller?: boolean;
}
export interface CartItem extends Product {
  quantity: number;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, customPrice?: number) => void;
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

export const products: Product[] = [
  {
    id: "1",
    name: "The best memories we ever made.",
    description:
      "A romantic blend of deep red roses and warm amber, perfect for intimate evenings.",
    originalPrice: 1499,
    price: 1099,
    image:
      "https://image2url.com/r2/default/images/1768666787057-dbc11afe-6809-481c-9ebe-b4f8d71f0cd1.jpeg",
    mood: "romantic",
    collection: "quotes",

    burnTime: "32 hours",
  },
  {
    id: "2",
    name: "Emotions i can't put into texts",
    description:
      "Calming lavender and vanilla notes that bring peace to any space.",
    price: 1099,
    originalPrice: 1499,

    image:
      "https://image2url.com/r2/default/images/1768667554567-f3cd2271-8515-467f-822d-59d8914b564b.jpeg",
    mood: "sad",
    collection: "quotes",

    burnTime: "32 hours",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Hotter than this candle",
    description:
      "Bold oud and black pepper for those who appreciate sophisticated intensity.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668465815-8e7f0648-0c65-4a34-9be3-0290ce7cdbea.jpeg",
    mood: "angry",
    collection: "quotes",

    burnTime: "32 hours",
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Hugs that don't need words",
    description:
      "Uplifting citrus and bergamot that radiates happiness and warmth.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668492559-dc54e6d8-8e18-4faf-a41d-b6730e32becc.jpeg",
    mood: "happy",
    collection: "quotes",
    burnTime: "32 hours",
    isBestSeller: true,
  },

  {
    id: "5",
    name: "Light this instead of burning out",
    description:
      "Fresh green tea and mint to start your day with positive energy.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668516045-9c90a2eb-30de-4f36-afc6-2a44bf164ef7.jpeg",
    mood: "happy",
    collection: "quotes",
    burnTime: "32 hours",
  },
  {
    id: "6",
    name: "Love and bad decisions",
    description: "Warm cedarwood and honey for quiet moments of reflection.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668555179-ea0051c3-7d05-45b1-a608-f0b93313ca3f.jpeg",
    mood: "sad",
    collection: "quotes",
    burnTime: "32 hours",
  },
  {
    id: "7",
    name: "Love gets better than wine",
    description: "Intense cinnamon and clove for bold, passionate souls.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668580411-ac8d58dd-6bcf-4869-8ad9-a61bd0b4f45d.jpeg",
    mood: "angry",
    collection: "quotes",
    burnTime: "32 hours",
  },
  {
    id: "8",
    name: "Our happily ever after",
    description: "Classic rose and musk blend that speaks of timeless romance.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668601977-b631c560-3b51-4651-8d49-b8a29592313e.jpeg",
    mood: "romantic",
    collection: "quotes",
    isBestSeller: true,
    burnTime: "32 hours",
  },
  {
    id: "9",
    name: "Vibes better than my ex's attitude",
    description: "Classic rose and musk blend that speaks of timeless romance.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668653940-71613bb4-1b35-4e9a-a432-cb80d4008804.jpeg",
    mood: "romantic",
    collection: "quotes",
    burnTime: "32 hours",
  },
  {
    id: "10",
    name: "Warning may ignite spontaneous cuddling",
    description: "Classic rose and musk blend that speaks of timeless romance.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668702004-4a33d5e2-5c1e-4943-967e-2abbdb68630b.jpeg",
    mood: "romantic",
    collection: "quotes",
    burnTime: "32 hours",
  },
  {
    id: "11",
    name: "You didn't want a gift, so here's this",
    description: "Classic rose and musk blend that speaks of timeless romance.",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1768668725358-3e70c434-dcc4-4e5c-b1bb-74bc4473ac1b.jpeg",
    mood: "romantic",
    collection: "quotes",
    burnTime: "32 hours",
  },
  // NOOR COLLECTION
  {
    id: "12",
    name: "Aurora Glass Candle - Noor",
    description: "Soft floral fragrance",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773296421569-15acf6bd-89f1-49ee-a900-aaad75ed09dc.png",
    mood: "romantic",
    collection: "noor",
    burnTime: "28 hours",
  },
  {
    id: "13",
    name: "Amber Ritual Candle - Noor",
    description: "Warm romantic candle",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773296538387-a278c5c1-26cb-4e5e-af8a-00d86401cbd1.blob",
    mood: "romantic",
    collection: "noor",
    burnTime: "28 hours",
  },
  {
    id: "14",
    name: "Black Aura Candle - Noor",
    description: "Luxury scent for couples",
    price: 1499,
    originalPrice: 1999,
    image:
      "https://image2url.com/r2/default/images/1773296603527-596ec2ac-8eee-4c51-b620-1620c60fc732.png",
    mood: "romantic",
    collection: "noor",
    burnTime: "28 hours",
  },
  {
    id: "15",
    name: "Pure Ivory Candle - Noor",
    description: "Luxury rose aroma for romantic evenings",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://image2url.com/r2/default/images/1773296361288-e931d428-ae82-4759-bf98-6991c836d41d.png",
    mood: "romantic",
    collection: "noor",
    burnTime: "31 hours",
  },

  // ZARA COLLECTION
  {
    id: "16",
    name: "Aurora Glass Candle - Zara",
    description: "Bright citrus aroma",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773296707414-fe9e4a22-5858-4034-a693-03d2749adf03.png",
    mood: "happy",
    collection: "zara",
    burnTime: "28 hours",
  },
  {
    id: "17",
    name: "Amber Ritual Candle - Zara",
    description: "Fresh uplifting scent",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773296768580-c6ba17c7-d21d-49c7-86be-1196e79f5e44.png",
    mood: "happy",
    collection: "zara",
    burnTime: "28 hours",
  },
  {
    id: "18",
    name: "Black Aura Candle - Zara",
    description: "Positive energy candle",
    price: 1499,
    originalPrice: 1999,
    image:
      "https://image2url.com/r2/default/images/1773296902194-a9aa3d81-5056-47c8-92a3-ea0e51db1190.blob",
    mood: "happy",
    collection: "zara",
    burnTime: "28 hours",
  },
  {
    id: "19",
    name: "Aurora Glass Candle - Zara",
    description: "Fresh morning energy",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://image2url.com/r2/default/images/1773296643961-0585de3a-2ac9-4d44-bef2-513398d6c975.png",
    mood: "happy",
    collection: "zara",
    burnTime: "31 hours",
  },

  // RUNE COLLECTION
  {
    id: "20",
    name: "Aurora Glass Candle - Rune",
    description: "Meditation fragrance",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773239917803-c7f0bc0a-d3b0-4679-9882-d283f53b19f0.png",
    mood: "sad",
    collection: "rune",
    burnTime: "28 hours",
  },
  {
    id: "21",
    name: "Amber Ritual Candle - Rune",
    description: "Fresh relaxing scent",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773297029887-64a55672-2098-4c98-886a-11854fb2a7f4.png",
    mood: "sad",
    collection: "rune",
    burnTime: "28 hours",
  },
  {
    id: "22",
    name: "Black Aura Candle - Rune",
    description: "Deep relaxing aroma",
    price: 1499,
    originalPrice: 1999,
    image:
      "https://image2url.com/r2/default/images/1773297076668-5b4ebbf3-95ff-4f90-ab0a-c5040fa71463.png",
    mood: "sad",
    collection: "rune",
    burnTime: "28 hours",
  },
  {
    id: "23",
    name: "Pure Ivory Candle - Rune",
    description: "Relaxing woody aroma",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://image2url.com/r2/default/images/1773239882263-d5c02b05-57b4-481e-9539-d641ca740bdc.png",
    mood: "sad",
    collection: "rune",
    burnTime: "31 hours",
  },

  // AMARA COLLECTION
  {
    id: "24",
    name: "Aurora Glass Candle - Amara",
    description: "Intense fragrance",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773302299373-84ffa7e7-d518-4eb4-9ac4-794fd7841f98.blob",
    mood: "angry",
    collection: "amara",
    burnTime: "28 hours",
  },
  {
    id: "25",
    name: "Amber Ritual Candle - Amara",
    description: "Powerful bold scent",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773297363650-360fcc5a-f48a-42c8-82c9-ae0fc0d83bf1.png",
    mood: "angry",
    collection: "amara",
    burnTime: "28 hours",
  },
  {
    id: "26",
    name: "Black Aura Candle - Amara",
    description: "Intense candle aroma",
    price: 1499,
    originalPrice: 1999,
    image:
      "https://image2url.com/r2/default/images/1773297408302-e4a0710d-e6e8-413e-9efb-245f196d7a02.png",
    mood: "angry",
    isBestSeller: true,
    collection: "amara",
    burnTime: "28 hours",
  },
  {
    id: "27",
    name: "Aurora Glass Candle - Amara",
    description: "Strong masculine aroma",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://image2url.com/r2/default/images/1773297158202-05bb9e18-5fed-45fb-b702-7a22efa566af.png",
    mood: "angry",
    collection: "amara",
    burnTime: "31 hours",
  },

  // VIELLA COLLECTION
  {
    id: "28",
    name: "Aurora Glass Candle - Viella",
    description: "Elegant gift candle",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773297518449-ff17bc50-b0f5-4388-a274-3564d1f54f90.png",
    mood: "happy",
    collection: "viella",
    burnTime: "28 hours",
  },
  {
    id: "29",
    name: "Amber Ritual Candle - Viella",
    description: "Luxury fragrance",
    price: 1099,
    originalPrice: 1499,
    image:
      "https://image2url.com/r2/default/images/1773302408811-633889b7-1d4a-4c49-a706-92ac505cdcff.png",
    mood: "happy",
    collection: "viella",
    burnTime: "28 hours",
  },
  {
    id: "30",
    name: "Black Aura Candle - Viella",
    description: "Premium gifting candle",
    price: 1499,
    originalPrice: 1999,
    image:
      "https://image2url.com/r2/default/images/1773297746296-a380e524-730d-4a79-b1c7-fed6d794940c.png",
    mood: "happy",
    collection: "viella",
    burnTime: "28 hours",
  },
  {
    id: "31",
    name: "Pure Ivory Candle - Viella",
    description: "Perfect gifting candle",
    price: 2499,
    originalPrice: 2999,
    image:
      "https://image2url.com/r2/default/images/1773297465975-eebc9daa-59cf-44e2-863b-919347bdd28f.png",
    mood: "happy",
    collection: "viella",
    burnTime: "31 hours",
  },
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();

  const getCartKey = (userId?: string | null) =>
    userId ? `candlesngiggles-cart-${userId}` : `candlesngiggles-cart`;

  const getWishlistKey = (userId?: string | null) =>
    userId ? `candlesngiggles-wishlist-${userId}` : `candlesngiggles-wishlist`;

  const prevUserRef = useRef<typeof user | null>(null);
  const [isServerSynced, setIsServerSynced] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const key = getCartKey(null);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const key = getWishlistKey(null);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart/wishlist to the appropriate per-user key whenever they change
  useEffect(() => {
    try {
      const key = getCartKey(user?.id ?? null);
      localStorage.setItem(key, JSON.stringify(cart));
    } catch {}
  }, [cart, user?.id]);

  useEffect(() => {
    try {
      const key = getWishlistKey(user?.id ?? null);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, user?.id]);

  const prevCartRef = useRef(cart);
  const prevWishlistRef = useRef(wishlist);

  // When user is logged in, persist cart and wishlist to server
  useEffect(() => {
    if (!user || !token || !isServerSynced) return;

    // Prevent saving if cart hasn't changed (avoids overwriting server data on login/refresh)
    if (cart === prevCartRef.current) return;
    prevCartRef.current = cart;

    // fire-and-forget persistence; failures are ignored (localStorage is fallback)
    (async () => {
      try {
        console.log("Saving cart to server...", cart);
        await saveUserCart(token, cart);
        console.log("Cart saved successfully");
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
      } catch (e) {}
    })();
  }, [wishlist, user, token, isServerSynced]);

  // When auth changes: merge guest cart into user cart on login; on logout, switch to global
  useEffect(() => {
    const prevUser = prevUserRef.current;
    const currUser = user ?? null;

    // Use an async IIFE to allow awaiting server calls
    (async () => {
      // Login (guest -> user): fetch server cart/wishlist and merge with guest local data
      if (!prevUser && currUser) {
        setIsServerSynced(false);
        try {
          const guestKey = getCartKey(null);
          let guest = [];
          try {
            guest = JSON.parse(localStorage.getItem(guestKey) || "[]");
          } catch (e) {
            console.error("Failed to parse guest cart", e);
            localStorage.removeItem(guestKey);
          }

          // fetch server-side saved cart if token available
          let serverCart: any[] = [];
          try {
            if (token) {
              console.log("Fetching server cart...");
              const res = await getUserCart(token);
              serverCart = res.cart || [];
              console.log("Fetched server cart:", serverCart);
            }
          } catch (e) {
            console.error("Failed to fetch server cart", e);
            serverCart = JSON.parse(
              localStorage.getItem(getCartKey(currUser.id)) || "[]",
            );
          }

          const merged = mergeCarts(serverCart, guest);
          setCart(merged);
          // Update ref to prevent immediate save of merged data (since it's already sync'd or will be saved if needed)
          prevCartRef.current = merged;

          // persist merged to server and per-user localStorage
          try {
            if (token) await saveUserCart(token, merged);
          } catch (e) {}
          localStorage.setItem(getCartKey(currUser.id), JSON.stringify(merged));
          localStorage.removeItem(guestKey);
        } catch (e) {}

        try {
          const guestW = JSON.parse(
            localStorage.getItem(getWishlistKey(null)) || "[]",
          );

          let serverW: any[] = [];
          try {
            if (token) {
              const resW = await getUserWishlist(token);
              serverW = resW.wishlist || [];
            }
          } catch (e) {
            serverW = JSON.parse(
              localStorage.getItem(getWishlistKey(currUser.id)) || "[]",
            );
          }

          const mergedW = mergeWishlist(serverW, guestW);
          setWishlist(mergedW);
          prevWishlistRef.current = mergedW;

          try {
            if (token) await saveUserWishlist(token, mergedW);
          } catch (e) {}
          localStorage.setItem(
            getWishlistKey(currUser.id),
            JSON.stringify(mergedW),
          );
          localStorage.removeItem(getWishlistKey(null));
        } catch (e) {}

        setIsServerSynced(true);
      }

      // Logout (user -> guest): clear to a neutral global state (empty cart/wishlist)
      if (prevUser && !currUser) {
        setIsServerSynced(false); // Reset sync state
        try {
          const globalKey = getCartKey(null);
          localStorage.setItem(globalKey, JSON.stringify([]));
          setCart([]);
        } catch (e) {}

        try {
          const globalWKey = getWishlistKey(null);
          localStorage.setItem(globalWKey, JSON.stringify([]));
          setWishlist([]);
        } catch (e) {}
      }
    })();

    prevUserRef.current = currUser;
  }, [user, token]);

  // Persist cart/wishlist to the appropriate per-user key whenever they change
  useEffect(() => {
    try {
      const key = getCartKey(user?.id ?? null);
      localStorage.setItem(key, JSON.stringify(cart));
    } catch {}
  }, [cart, user?.id]);

  useEffect(() => {
    try {
      const key = getWishlistKey(user?.id ?? null);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, user?.id]);

  function mergeCarts(a: CartItem[], b: CartItem[]) {
    const map = new Map<string, CartItem>();
    (a || []).forEach((item) => map.set(item.id, { ...item }));
    (b || []).forEach((item) => {
      const existing = map.get(item.id);
      if (existing)
        existing.quantity = (existing.quantity || 0) + item.quantity;
      else map.set(item.id, { ...item });
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
    setCart((prev) => {
      // Use custom price if provided (e.g., for free rewards), otherwise use product's default price
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
      return [...prev, { ...product, price: priceToUse, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
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
