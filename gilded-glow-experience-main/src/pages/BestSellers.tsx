import { useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";

const BestSellers = () => {
  const { products } = useStore();

  // Get only bestseller candles (limit 6)
  const bestSellers = useMemo(() => {
    return products.filter((p) => p.isBestSeller).slice(0, 6);
  }, [products]);

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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-primary mb-4">
              Best Sellers
            </h1>

            <p className="text-foreground/60 font-light tracking-wide">
              Our most loved candles chosen by customers
            </p>

            <div className="luxury-divider mt-6" />
          </motion.div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BestSellers;
