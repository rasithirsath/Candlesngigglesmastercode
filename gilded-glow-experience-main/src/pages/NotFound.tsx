import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-8xl font-light text-primary mb-4">404</h1>
        <h2 className="text-2xl font-light tracking-[0.1em] text-foreground/80 mb-6">
          Page Not Found
        </h2>
        <p className="text-foreground/60 font-light mb-8">
          The page you are looking for seems to have wandered off into the candlelight.
        </p>
        <Link to="/">
          <Button variant="luxuryOutline" size="lg">
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
