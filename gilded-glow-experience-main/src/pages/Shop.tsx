import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useStore();

  // Read collection from URL
  const collectionFilter = searchParams.get("collection") || "all";

  // Collection filter buttons
  const collections = [
    // { key: "all", name: "All" },
    { key: "noor", name: "Noor" },
    { key: "zara", name: "Zara" },
    { key: "rune", name: "Rune" },
    { key: "amara", name: "Amara" },
    { key: "viella", name: "Viella" },
    { key: "quotes", name: "Shop By Quotes" },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    if (collectionFilter === "all") return products;

    return products.filter(
      (product) => product.collection === collectionFilter,
    );
  }, [products, collectionFilter]);

  // Collection titles
  const collectionNames: Record<string, string> = {
    noor: "Noor Collection",
    zara: "Zara Collection",
    rune: "Rune Collection",
    amara: "Amara Collection",
    viella: "Viella Collection",
    quotes: "Shop By Quotes",
  };

  const pageTitle =
    collectionFilter === "all"
      ? "All Candles"
      : collectionNames[collectionFilter] || "Collection";

  const pageDescription =
    collectionFilter === "all"
      ? "Explore our luxury candle collection"
      : "Explore this exclusive candle collection";

  return (
    <div className="min-h-screen bg-background">
      {" "}
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
              {pageDescription}
            </p>

            <div className="luxury-divider mt-6" />
          </motion.div>

          {/* Collection Filter Bar */}
          <div className="flex justify-center gap-6 mb-12 flex-wrap">
            {collections.map((collection) => {
              const active = collectionFilter === collection.key;

              return (
                <button
                  key={collection.key}
                  onClick={() => {
                    if (collection.key === "all") {
                      navigate("/shop");
                    } else {
                      navigate(`/shop?collection=${collection.key}`);
                    }
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

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={collectionFilter}
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
                transition={{ duration: 0.8 }}
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
