import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product, useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

import candle1 from "@/assets/candle-1.jpeg";
import candle2 from "@/assets/candle-2.jpeg";
import candle3 from "@/assets/candle-3.jpeg";
import candle4 from "@/assets/candle-4.jpeg";

const imageMap: Record<string, string> = {
  "/candle-1.jpeg": candle1,
  "/candle-2.jpeg": candle2,
  "/candle-3.jpeg": candle3,
  "/candle-4.jpeg": candle4,
};

const QuizResult = () => {
  const location = useLocation();
  const { products, addToCart } = useStore();
  const { answers } = location.state || {};

  // Simple recommendation logic based on mood answer
  const moodMap: Record<string, "romantic" | "happy" | "sad" | "angry"> = {
    romantic: "romantic",
    happy: "happy",
    calm: "sad",
    bold: "angry",
  };

  const recommendedMood = moodMap[answers?.[1]] || "romantic";
  const recommendedProducts = products
    .filter((p) => p.mood === recommendedMood)
    .slice(0, 3);

  const personalMessages: Record<string, string> = {
    romantic:
      "We sense love in the air. These candles will set the perfect mood for intimate moments.",
    happy:
      "Celebration awaits! These fragrances will fill your space with joy and warmth.",
    sad: "Time for tranquility. These calming scents will bring peace to your soul.",
    angry:
      "Channel your passion. These bold fragrances match your fierce spirit.",
  };

  const handleAddToCart = (product: Product) => {
    const ok = addToCart(product);
    if (ok) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("This product is currently out of stock");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Personalized Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-primary mb-6">
              Your Perfect Match
            </h1>
            <p className="text-lg text-foreground/60 font-light leading-relaxed max-w-xl mx-auto">
              {personalMessages[recommendedMood]}
            </p>
            <div className="luxury-divider mt-8" />
          </motion.div>

          {/* Recommended Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedProducts.map((product, index) => {
              const imageSrc = product.image?.startsWith("http")
                ? product.image
                : imageMap[product.image] || product.image || candle1;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Gold Glow Effect */}
                  <div className="absolute -inset-2 bg-primary/10 rounded-sm blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative luxury-card overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-light tracking-[0.1em] text-primary mb-2">
                        {product.name}
                      </h3>
                      <p className="text-foreground/50 text-sm font-light mb-4">
                        {product.description}
                      </p>
                      <p className="text-lg text-foreground/80 font-light mb-6">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="heroFilled"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </Button>
                        <Link to={`/product/${product.id}`}>
                          <Button variant="luxuryOutline" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link to="/shop">
              <Button variant="luxuryOutline" size="lg">
                Explore All Candles
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuizResult;
