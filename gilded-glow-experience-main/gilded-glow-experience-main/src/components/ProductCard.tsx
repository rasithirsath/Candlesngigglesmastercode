import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, Product } from "@/contexts/StoreContext";
import { toast } from "sonner";

/* IMPORT LOCAL IMAGES */
import candle1 from "@/assets/candle-1.jpeg";
import candle2 from "@/assets/candle-2.jpeg";
import candle3 from "@/assets/candle-3.jpeg";
import candle4 from "@/assets/candle-4.jpeg";

/* IMAGE MAP */
const imageMap: Record<string, string> = {
  "candle-1.jpeg": candle1,
  "candle-2.jpeg": candle2,
  "candle-3.jpeg": candle3,
  "candle-4.jpeg": candle4,
};

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();

  const inWishlist = isInWishlist(product.id);

  /* RESOLVE IMAGE */
  const imageSrc = product.image.startsWith("http")
    ? product.image
    : imageMap[product.image] || candle1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/product/${product.id}`}>
        <div
          className="group relative overflow-hidden luxury-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 p-2 bg-background/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary/20"
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                inWishlist ? "fill-primary text-primary" : "text-foreground/80"
              }`}
            />
          </button>

          {/* Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gold Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-80" : "opacity-0"
              }`}
            />
          </div>

          {/* Product Info */}
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <h3 className="text-lg font-light tracking-[0.1em] text-primary mb-2">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-3 mb-6">
              {product.originalPrice && (
                <span className="text-sm text-foreground/40 line-through tracking-wide">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}

              <span className="text-xl text-primary font-light tracking-[0.05em]">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            <Button
              variant="luxuryOutline"
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </Button>
          </motion.div>

          {/* Border Glow */}
          <div
            className={`absolute inset-0 border transition-all duration-700 ${
              isHovered
                ? "border-primary/30 shadow-[0_0_30px_hsl(43_45%_59%_/_0.1)]"
                : "border-primary/0"
            }`}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
