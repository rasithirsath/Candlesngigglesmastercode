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
        {/* LUXURY SUCCESS ICON */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mx-auto mb-16 w-[140px] h-[140px] flex items-center justify-center"
        >
          {/* glow */}
          <div className="absolute -inset-16 bg-primary/20 blur-[100px] rounded-full" />

          {/* circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-[110px] h-[110px] border border-primary rounded-full flex items-center justify-center"
          >
            {/* checkmark */}
            <motion.svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b49b4a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.path d="M5 13l4 4L19 7" />
            </motion.svg>
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
