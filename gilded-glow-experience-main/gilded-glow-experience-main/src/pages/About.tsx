import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import heroImage from "@/assets/hero-candle.jpg";
import ceoImage from "@/assets/ceo-portrait.jpg";
import cooImage from "@/assets/coo-portrait.jpg";

const About = () => {
  const craftFeatures = [
    {
      icon: Flame,
      title: "Hand-Poured",
      description: "Every candle is carefully poured by skilled artisans.",
    },
    {
      icon: Heart,
      title: "Premium Wax",
      description: "We use only the finest natural soy wax for a clean burn.",
    },
    {
      icon: Gift,
      title: "Gift-Ready",
      description: "Designed for gifting with elegant packaging.",
    },
  ];

  const leadership = [
    {
      name: "Akib Suhail",
      role: "Chief Executive Officer",
      image: ceoImage,
      description:
        "With over 15 years in luxury retail, Arjun brings a passion for craftsmanship and emotional storytelling to every candle we create.",
    },
    {
      name: "Faheem Khan",
      role: "Chief Operating Officer",
      image: cooImage,
      description:
        "Priya ensures every aspect of our operations reflects our commitment to quality, sustainability, and customer delight.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About candlesngiggles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.15em] text-primary text-shadow-gold mb-6">
            Where emotions meet fragrance
          </h1>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-8">
              Our Story
            </h2>
            <div className="luxury-divider mb-12" />
            <div className="space-y-6 text-foreground/70 font-light leading-relaxed text-lg">
              <p>
                Candles & Giggles didn’t start as a business idea. It started as
                a problem, a very familiar one. We were searching for a gift for
                a close friend. Not just any gift, but something that truly
                reflected who they were — their humour, their memories, and the
                bond we shared with them. Something that could make them smile,
                laugh, or even feel a little emotional.
              </p>

              <p>
                Everywhere we looked, it was the same story. Generic gifts that
                looked nice but meant nothing. We didn’t want something that
                would be opened, admired for a few seconds, and then forgotten
                on a shelf. We wanted a gift that spoke. Something personal
                without being complicated. Something that quietly said, “This
                reminds me of you.”
              </p>

              <p>
                That’s when the idea clicked. What if a candle could do more
                than just smell good? What if it could carry a feeling, a joke,
                or a memory? What if lighting a candle could instantly bring
                back laughter, a moment, or a connection?
              </p>

              <p>
                That thought became Candles & Giggles. We began creating candles
                that aren’t just products but experiences — candles filled with
                funny, cheeky, heartfelt, and emotional quotes people genuinely
                relate to. They became inside jokes, romantic gestures, comfort
                gifts, and celebration pieces all in one.
              </p>

              <p>
                Every candle we design is inspired by real moments —
                friendships, relationships, late-night conversations, bad
                decisions, great memories, and the small emotions that make life
                unforgettable.
              </p>

              <p>
                Candles & Giggles exists because we couldn’t find the perfect
                gift, so we decided to create it ourselves. We don’t just sell
                candles. We sell feelings, memories, and giggles — one flame at
                a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Craft */}
      <section className="py-24 px-6 bg-charcoal-light">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              Our Craft
            </h2>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {craftFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center p-8 luxury-card hover-glow"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 rounded-full flex items-center justify-center">
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

      {/* Leadership Section */}

      {/* Why We Exist */}
      <section className="py-24 px-6 bg-charcoal-light">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-8">
              Why We Exist
            </h2>
            <div className="luxury-divider mb-12" />
            <p className="text-xl md:text-2xl text-foreground/60 font-light leading-relaxed italic">
              "We exist to add warmth to your world — one flame, one fragrance,
              one emotion at a time. Because in a world that moves so fast,
              everyone deserves a moment of pause, wrapped in the gentle glow of
              candlelight."
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em] text-primary mb-8">
              Find the perfect candle
            </h2>
            <Link to="/quiz">
              <Button variant="hero" size="xl">
                Take the Quiz
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
