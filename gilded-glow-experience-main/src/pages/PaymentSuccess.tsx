import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Candle Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-32 h-48 mx-auto mb-12"
        >
          {/* Candle Body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-ivory to-ivory/80 rounded-t-md" />

          {/* Wick */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-1 h-4 bg-charcoal-medium" />

          {/* Flame */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-36 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl" />
              {/* Flame Shape */}
              <div
                className="w-6 h-10 bg-gradient-to-t from-primary via-gold-light to-ivory rounded-full transform -translate-y-2"
                style={{ clipPath: "ellipse(50% 70% at 50% 100%)" }}
              />
              {/* Inner Flame */}
              <div
                className="absolute inset-0 w-3 h-6 mx-auto mt-2 bg-gradient-to-t from-ivory to-transparent rounded-full"
                style={{ clipPath: "ellipse(50% 70% at 50% 100%)" }}
              />
            </motion.div>
          </motion.div>

          {/* Warm Light Spread */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.3, scale: 2 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="absolute bottom-36 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary rounded-full blur-3xl"
          />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-primary mb-4">
            Payment Successfully Completed
          </h1>
          <p className="text-foreground/60 font-light mb-8">
            Thank you for your order. Your candles will be on their way soon.
          </p>
          <Link to="/">
            <Button variant="luxuryOutline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
