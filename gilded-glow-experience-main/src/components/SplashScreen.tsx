import { motion } from "framer-motion";
import ParticleExplosion from "./ParticleExplosion";

interface Props {
  setShowSplash: (value: boolean) => void;
}

export default function SplashScreen({ setShowSplash }: Props) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden px-6">
      {/* Particle Background */}
      <ParticleExplosion />

      {/* Floating Gold Dust */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-20, -200],
              x: Math.random() * 80 - 40,
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
            className="absolute w-[2px] h-[2px] bg-[#E8D7A5] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "0%",
            }}
          />
        ))}
      </div>

      {/* Cinematic Light Sweep */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[300px] h-[1200px] bg-gradient-to-r from-transparent via-[#E8D7A5]/10 to-transparent rotate-12 blur-3xl"
      />

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="text-center z-10 relative"
      >
        {/* Gold Glow Behind Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute w-[600px] h-[600px] bg-[#E8D7A5]/20 blur-[180px] rounded-full -z-10"
        />

        {/* Logo */}
        <motion.img
          src="/logo/candlesngiggles-logo.png"
          className="h-32 mx-auto mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.7em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 2.5, delay: 0.5 }}
          className="text-6xl font-light tracking-[0.35em]"
          style={{ color: "#E8D7A5" }}
        >
          CANDLES & GIGGLES
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 tracking-[0.4em] text-sm"
          style={{ color: "#D4C494" }}
        >
          LUXURY CANDLE EXPERIENCE
        </motion.p>

        {/* New Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          onClick={() => setShowSplash(false)}
          className="mt-14 px-12 py-3 border tracking-[0.35em] text-sm hover:bg-[#E8D7A5]/10 transition-all duration-500"
          style={{ borderColor: "#E8D7A5", color: "#E8D7A5" }}
        >
          Begin the Experience
        </motion.button>
      </motion.div>
    </div>
  );
}
