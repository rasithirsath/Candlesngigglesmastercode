import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden relative">
      {/* GOLD DUST PARTICLES */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.8, 0], y: -200 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
          className="absolute w-[2px] h-[2px] bg-primary rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-20px",
          }}
        />
      ))}

      {/* CENTER CONTENT */}
      <div className="text-center relative z-10">
        {/* CANDLE */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="relative mx-auto mb-20 w-[140px] h-[240px]"
        >
          {/* candle glow */}
          <div className="absolute -inset-20 bg-primary/10 blur-[120px] rounded-full" />

          {/* candle body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90px] h-[170px] bg-gradient-to-b from-[#f7f2e9] to-[#e4dccb] rounded-t-md shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />

          {/* wick */}
          <div className="absolute bottom-[170px] left-1/2 -translate-x-1/2 w-[4px] h-[14px] bg-black rounded" />

          {/* flame */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="absolute bottom-[180px] left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* flame glow */}
              <div className="absolute -inset-14 bg-[#d4af37]/30 blur-[80px] rounded-full" />

              {/* flame */}
              <div
                className="w-[18px] h-[34px] bg-gradient-to-t from-[#d4af37] via-[#f3d88b] to-[#fff6cc] rounded-full"
                style={{
                  clipPath: "ellipse(50% 70% at 50% 100%)",
                }}
              />

              {/* inner flame */}
              <div
                className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[10px] h-[18px] bg-white/80 rounded-full"
                style={{
                  clipPath: "ellipse(50% 70% at 50% 100%)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SUCCESS TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <h1 className="text-[40px] md:text-[52px] tracking-[0.25em] text-primary font-light mb-6">
            ORDER CONFIRMED
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 2.3, duration: 1 }}
            className="h-[1px] bg-primary/40 mx-auto mb-8"
          />

          <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-10">
            Your candle experience has begun. Our artisans are preparing your
            order with care.
          </p>

          <Link to="/">
            <Button
              variant="luxuryOutline"
              size="lg"
              className="tracking-[0.2em] px-10"
            >
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* SUBTLE LIGHT BEAM */}
      <motion.div
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d4af3720,transparent_60%)]"
      />
    </div>
  );
};

export default PaymentSuccess;
