import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  Flame,
  Gift,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";
import { useState } from "react";

import heroImage from "@/assets/hero-candle.jpg";
import moodHappy from "@/assets/mood-happy.jpg";
import moodRomantic from "@/assets/mood-romantic.jpg";
import moodSad from "@/assets/mood-sad.jpg";
import moodAngry from "@/assets/mood-angry.jpg";
import flameLogo from "@/assets/flame-g.png";

const Index = () => {
  const { products } = useStore();
  const bestSellers = products.filter((p) => p.isBestSeller);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: "Premium Wax",
      description: "Hand-selected natural soy wax for a clean, even burn.",
    },
    {
      icon: Clock,
      title: "Long-Lasting",
      description: "Up to 50 hours of enchanting fragrance.",
    },
    {
      icon: Flame,
      title: "Handcrafted",
      description: "Each candle is poured with intention and care.",
    },
    {
      icon: Gift,
      title: "Gift Ready",
      description: "Elegantly packaged for every occasion.",
    },
  ];

  const moods = [
    { name: "Happy", image: moodHappy, filter: "happy" },
    { name: "Romantic", image: moodRomantic, filter: "romantic" },
    { name: "Calm", image: moodSad, filter: "sad" },
    { name: "Bold", image: moodAngry, filter: "angry" },
  ];

  const testimonials = [
    {
      name: "Kashish Goyal",
      text: "Really impressed with the candles and it's quality!! The packaging makes it even more luxury and special.",
      rating: 5,
    },
    {
      name: "Sarah Hameed",
      text: "Loved the candles! Can really see the effort in the quality and the packaging makes it even more special!",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      text: "Finally found a candle brand that understands luxury. The Pure Ivory Candle from the Viella Collection is my go to for meditation sessions.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.1em] text-primary text-shadow-gold mb-6">
              Light Your Emotions
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/70 font-light tracking-wide mb-12 max-w-2xl mx-auto"
          >
            Handcrafted luxury candles designed to evoke emotions, create
            memories, and transform every moment into something extraordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/shop">
              <Button variant="hero" size="xl">
                Shop Now
              </Button>
            </Link>
            <Link to="/customize">
              <Button variant="heroFilled" size="xl">
                Help Me to Gift
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border border-primary/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Why candlesngiggles */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Why Candles&Giggles
            </h2>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center p-8 luxury-card hover-glow group"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 rounded-full flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(43_45%_59%_/_0.2)] transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-light tracking-[0.1em] text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 font-light text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Our Partners
            </h2>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 flex items-center justify-center"
            >
              <img
                src="https://image2url.com/r2/default/images/1775325490212-dc3177ba-440c-4b89-bbb6-b3dbcd7163ef.png"
                alt="Partner Logo 1"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className=" p-8 flex items-center justify-center"
            >
              <img
                src="https://image2url.com/r2/default/images/1775325533056-1cf5da76-3125-4701-a218-e3789b12e31e.png"
                alt="Partner Logo 2"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Shop By Mood */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Heading */}
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-2xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Shop By Collections
            </h2>
            <p className="text-foreground/60 font-light text-sm md:text-base">
              Find the perfect candle for every emotion
            </p>
          </div>

          <div className="space-y-6 md:space-y-10">
            {/* Noor */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773084201370-2145edac-ccf1-4483-abef-5871e36b7c4a.png"
                alt="Noor"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=noor">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Zara */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773084270936-925f3a17-ff80-4cbf-9df2-44e3a85587fa.png"
                alt="Zara"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=zara">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Rune */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773084329484-1409b5e2-3e49-488e-a2db-4c20f2bc3733.png"
                alt="Rune"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=rune">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Amara */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773084374823-693b9240-9f99-427c-b9cf-8c334a428e9c.png"
                alt="Amara"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=amara">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Viella */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773084412896-7dbe00dd-4059-44a7-b4e6-363b656e6c33.png"
                alt="Viella"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=viella">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quotes */}
            <div className="relative group overflow-hidden rounded-md h-[120px] sm:h-[160px] md:h-[200px] lg:h-[220px]cursor-pointer">
              <img
                src="https://image2url.com/r2/default/images/1773085348259-dafeaff1-769a-48ee-89fb-ff94c24457f4.png"
                alt="Quotes"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <Link to="/shop?collection=quotes">
                  <Button variant="luxuryOutline" size="sm">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Best Sellers */}
      <section className="py-24 px-6 bg-charcoal-light">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Best Sellers
            </h2>
            <p className="text-foreground/60 font-light tracking-wide">
              Our most beloved fragrances, chosen by our community
            </p>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/shop">
              <Button variant="luxuryOutline" size="lg">
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* View By Collections */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Shop by Mood
            </h2>
            <p className="text-foreground/60 font-light tracking-wide">
              Find the perfect candle for every emotion
            </p>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {moods.map((mood, index) => (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Link to={`/shop?mood=${mood.filter}`}>
                  <div className="relative group overflow-hidden aspect-[4/3] rounded-sm">
                    <img
                      src={mood.image}
                      alt={mood.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-background/40 group-hover:bg-background/60 transition-colors duration-500" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h3 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-primary mb-4">
                        {mood.name}
                      </h3>
                      <Button
                        variant="luxuryOutline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      >
                        Shop Now
                      </Button>
                    </div>
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-charcoal-light">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              What Our Customers Say
            </h2>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="relative">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="luxury-card p-12 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[testimonialIndex].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-primary text-primary"
                    />
                  ),
                )}
              </div>
              <p className="text-lg md:text-xl font-light text-foreground/80 italic leading-relaxed mb-8">
                "{testimonials[testimonialIndex].text}"
              </p>
              <p className="text-primary font-light tracking-[0.1em]">
                — {testimonials[testimonialIndex].name}
              </p>
            </motion.div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-primary/30 rounded-full hover:border-primary hover:shadow-[0_0_15px_hsl(43_45%_59%_/_0.2)] transition-all duration-500"
              >
                <ChevronLeft size={20} className="text-primary" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 border border-primary/30 rounded-full hover:border-primary hover:shadow-[0_0_15px_hsl(43_45%_59%_/_0.2)] transition-all duration-500"
              >
                <ChevronRight size={20} className="text-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
