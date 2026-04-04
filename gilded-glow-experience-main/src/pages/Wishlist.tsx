import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

import candle1 from "@/assets/candle-1.jpeg";
import candle2 from "@/assets/candle-2.jpeg";
import candle3 from "@/assets/candle-3.jpeg";
import candle4 from "@/assets/candle-4.jpeg";

const imageMap: Record<string, string> = {
  "/candle-1.jpg": candle1,
  "/candle-2.jpg": candle2,
  "/candle-3.jpg": candle3,
  "/candle-4.jpg": candle4,
};

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  const handleAddToCart = (product: (typeof wishlist)[0]) => {
    const ok = addToCart(product);
    if (ok) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("Out of stock");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-primary mb-4">
              Your Wishlist
            </h1>
            <div className="luxury-divider mt-6" />
          </motion.div>

          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <Heart size={64} className="mx-auto text-primary/30 mb-8" />
              <p className="text-xl text-foreground/60 font-light mb-8">
                Your wishlist is waiting for its first candle.
              </p>
              <Link to="/shop">
                <Button variant="luxuryOutline" size="lg">
                  Explore Candles
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((product, index) => {
                const imageSrc = product.image?.startsWith("http")
                  ? product.image
                  : imageMap[product.image] || candle1;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="luxury-card overflow-hidden group"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <h3 className="text-lg font-light tracking-[0.1em] text-primary mb-2">
                        {product.name}
                      </h3>
                      <p className="text-foreground/60 font-light mb-4">
                        ₹{(product.price || 0).toLocaleString()}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="luxuryOutline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(product.id, product.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
