import { useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";

const Shop = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const collectionFilter = searchParams.get("collection");
  const moodFilter = searchParams.get("mood");

  // Redirect /shop → /shop?collection=noor
  useEffect(() => {
    if (!collectionFilter && !moodFilter) {
      navigate("/shop?collection=noor", { replace: true });
    }
  }, [collectionFilter, moodFilter, navigate]);

  // Collection buttons
  const collections = [
    { key: "noor", name: "Noor" },
    { key: "zara", name: "Zara" },
    { key: "rune", name: "Rune" },
    { key: "amara", name: "Amara" },
    { key: "viella", name: "Viella" },
    { key: "quotes", name: "Shop By Quotes" },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const collectionMatch = collectionFilter
        ? product.collection === collectionFilter
        : true;

      const moodMatch = moodFilter ? product.mood === moodFilter : true;

      return collectionMatch && moodMatch;
    });
  }, [products, collectionFilter, moodFilter]);

  // Collection titles
  const collectionNames: Record<string, string> = {
    noor: "Noor Collection",
    zara: "Zara Collection",
    rune: "Rune Collection",
    amara: "Amara Collection",
    viella: "Viella Collection",
    quotes: "Shop By Quotes",
  };

  // Page title
  const pageTitle = useMemo(() => {
    if (moodFilter) {
      return `${moodFilter.charAt(0).toUpperCase() + moodFilter.slice(1)} Mood Candles`;
    }

    if (collectionFilter) {
      return collectionNames[collectionFilter] || "Collection";
    }

    return "All Candles";
  }, [collectionFilter, moodFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-primary mb-4">
              {pageTitle}
            </h1>

            <p className="text-foreground/60 font-light tracking-wide">
              Explore this exclusive candle collection
            </p>

            <div className="luxury-divider mt-6" />
          </motion.div>

          {/* Collection Filter */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            {collections.map((collection) => {
              const active = collectionFilter === collection.key;

              return (
                <button
                  key={collection.key}
                  onClick={() => {
                    navigate(
                      `/shop?collection=${collection.key}${
                        moodFilter ? `&mood=${moodFilter}` : ""
                      }`,
                    );
                  }}
                  className={`px-6 py-2 rounded-full text-sm tracking-wider transition-all duration-300
                    ${
                      active
                        ? "bg-primary text-black"
                        : "border border-primary/40 text-primary hover:bg-primary/10"
                    }`}
                >
                  {collection.name}
                </button>
              );
            })}
          </div>

          {/* Products */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={`${collectionFilter}-${moodFilter}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-foreground/60 text-lg">
                  No candles found in this collection
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
