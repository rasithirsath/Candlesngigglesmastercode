import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Music,
  Quote,
  Gift,
  Flame,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/SplashScreen";
import { Textarea } from "@/components/ui/textarea";
import { useStore, Product } from "@/contexts/StoreContext";
import MoodFilter, { MoodCategory } from "@/components/MoodFilter";

import candle1 from "@/assets/candle-1.jpeg";
import candle2 from "@/assets/candle-2.jpeg";
import candle3 from "@/assets/candle-3.jpeg";
import candle4 from "@/assets/candle-4.jpeg";

const QUOTES_PRICE = 20;
const MAX_QUOTE_LENGTH = 200;

const suggestedQuotes = [
  "You light up my darkest days.",
  "Every flame reminds me of you.",
  "For moments that deserve warmth.",
  "Burning bright, just like our love.",
];

const CustomizeJourney = () => {
  const navigate = useNavigate();
  const { products, addToCart, wishlist } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [showSpotifyPopup, setShowSpotifyPopup] = useState(false);

  // Selections
  // STEP 1 QUOTE (+120)

  const [selectedCandle, setSelectedCandle] = useState<Product | null>(null);
  // STEP 1 LABEL QUOTE (+120)

  const LABEL_QUOTE_PRICE = 10;

  const [labelQuote, setLabelQuote] = useState("");

  const [labelQuoteSubmitted, setLabelQuoteSubmitted] = useState(false);

  // FLOWER STEP (+300)
  const FLOWER_PRICE = 300;

  const flowerOptions = [
    {
      id: "flower1",
      name: "Rose Elegance",
      price: 300,
      image:
        "https://image2url.com/r2/default/images/1773305406994-4d9e3fc4-bed7-4858-ba92-6af29e48f0da.png",
    },

    {
      id: "flower2",
      name: "Velvet Bloom",
      price: 300,
      image:
        "https://image2url.com/r2/default/images/1773305461192-006098dc-778a-41c8-bdbc-4ff7bd878cee.png",
    },

    {
      id: "flower3",
      name: "Golden Romance",
      price: 300,
      image:
        "https://image2url.com/r2/default/images/1773305565432-7c3a9c08-233d-4b7f-8a26-5366948b1b61.jpeg",
    },

    {
      id: "flower4",
      name: "Soft Pastel",
      price: 300,
      image:
        "https://image2url.com/r2/default/images/1773305591915-c9abe396-84fc-4684-97ad-6f906b78b3e1.jpeg",
    },
  ];

  const [selectedFlower, setSelectedFlower] = useState<
    (typeof flowerOptions)[0] | null
  >(null);
  const [selectedBox, setSelectedBox] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
  } | null>(null);
  const [selectedSpotify, setSelectedSpotify] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [customQuote, setCustomQuote] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Filter products by mood (including wishlist)
  const filteredProducts = useMemo(() => {
    if (selectedCollection === "wishlist") {
      return wishlist;
    }

    if (selectedCollection === "all") {
      return products;
    }

    return products.filter(
      (product) => product.collection === selectedCollection,
    );
  }, [products, selectedCollection, wishlist]);

  // Auto-transition from splash
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const premiumBoxes = [
    {
      id: "box1",
      name: "Luxury Black Box",
      price: 249,
      image:
        "https://image2url.com/r2/default/images/1773169653498-67c41534-59dc-4cbc-8f65-c9c24647ae1f.blob",
    },
    {
      id: "box2",
      name: "Luxury Gold Box",
      price: 249,
      image:
        "https://image2url.com/r2/default/images/1773304935688-9ddd265f-08be-49c0-b1d9-c26b330eddbd.png",
    },
    {
      id: "box3",
      name: "Classic  Box",
      price: 0,
      image:
        "https://image2url.com/r2/default/images/1773169961306-cb26ef72-197f-4d1e-988b-c551ff28690d.blob",
    },
    // { id: "box4", name: "Crystal Elegance Box", price: 499, image: candle4 },
  ];

  const spotifyCards = [
    {
      id: "spotify1",
      name: "Calm & Cozy Playlist",
      price: 0,
      image:
        "https://image2url.com/r2/default/images/1773305219014-d89cf8a6-2c94-4bf4-acc3-cc206db75bc2.png",
    },
    {
      id: "spotify2",
      name: "Burning Desire Playlist",
      price: 0,
      image:
        "https://image2url.com/r2/default/images/1773305251710-9c561c6d-fece-4e93-913b-a5438c1b14c2.png",
    },
    {
      id: "spotify4",
      name: "Custom Playlist Card",
      price: 0,
      image:
        "https://image2url.com/r2/default/images/1773305296701-e53d5cc6-0362-44d6-af1a-235a5b52412d.png",
    },
  ];
  const calculateTotal = () => {
    let total = 0;

    if (selectedCandle) total += selectedCandle.price;

    if (selectedBox) total += selectedBox.price;

    if (selectedSpotify) total += selectedSpotify.price;

    if (quoteSubmitted && customQuote.trim()) total += QUOTES_PRICE;

    // NEW LABEL QUOTE PRICE
    if (labelQuoteSubmitted && labelQuote.trim()) total += LABEL_QUOTE_PRICE;

    if (selectedFlower) total += selectedFlower.price;

    return total;
  };

  const handleSubmitLabelQuote = () => {
    if (labelQuote.trim()) {
      setLabelQuoteSubmitted(true);
    }
  };
  const handleSubmitQuote = () => {
    if (customQuote.trim()) {
      setQuoteSubmitted(true);
    }
  };

  const handleAddToCart = () => {
    if (!selectedCandle) return;

    let customizationsTotal = 0;

    const customizations: any[] = [];

    // Gift Box
    if (selectedBox) {
      customizations.push({
        type: "giftbox",

        name: selectedBox.name,

        price: selectedBox.price,
      });

      customizationsTotal += selectedBox.price;
    }

    // Spotify
    if (selectedSpotify) {
      customizations.push({
        type: "spotify",

        name: selectedSpotify.name,

        price: selectedSpotify.price,
        playlist: spotifyLink || null,
      });

      customizationsTotal += selectedSpotify.price;
    }

    // Label Quote
    if (labelQuoteSubmitted && labelQuote.trim()) {
      customizations.push({
        type: "labelQuote",

        name: "Candle Label Message",

        price: LABEL_QUOTE_PRICE,

        message: labelQuote.trim(),
      });

      customizationsTotal += LABEL_QUOTE_PRICE;
    }

    // Personalized Quote
    if (quoteSubmitted && customQuote.trim()) {
      customizations.push({
        type: "quotes",

        name: "Personalized Message",

        price: QUOTES_PRICE,

        message: customQuote.trim(),
      });

      customizationsTotal += QUOTES_PRICE;
    }
    // Flower
    if (selectedFlower) {
      customizations.push({
        type: "flower",
        name: selectedFlower.name,
        price: selectedFlower.price,
      });

      customizationsTotal += selectedFlower.price;
    }

    addToCart({
      ...selectedCandle,

      customizations,

      customizationsTotal,
    } as any);

    navigate("/cart");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!selectedCandle;
      case 1:
        return !!selectedBox;
      case 2:
        return !!selectedSpotify;
      case 3:
        return quoteSubmitted && !!customQuote.trim();
      default:
        return true;
    }
  };

  const steps = [
    "Select Candle",

    "Select Box",

    "Spotify Card",

    "Quotes Card",

    "Flower Bouquet",

    "Review",
  ];

  if (showSplash) {
    return <SplashScreen setShowSplash={setShowSplash} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                currentStep > 0
                  ? setCurrentStep(currentStep - 1)
                  : navigate("/")
              }
              className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm tracking-wide">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                          ? "border-2 border-primary text-primary"
                          : "border border-foreground/20 text-foreground/40"
                    }`}
                  >
                    {index < currentStep ? <Check size={14} /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-[1px] ${index < currentStep ? "bg-primary" : "bg-foreground/20"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-right">
              <p className="text-xs text-foreground/50 uppercase tracking-wider">
                Total
              </p>
              <p className="text-primary font-light text-lg">
                ₹{calculateTotal().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-24 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Candle */}
            {currentStep === 0 && (
              <motion.div
                key="step-candle"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
                    Select Your Candle
                  </h2>
                  <p className="text-foreground/60 font-light">
                    Choose the perfect fragrance for your gift
                  </p>
                </div>

                {/* Mood Filter with Wishlist */}
                <div className="flex justify-center flex-wrap gap-3 mb-8">
                  {[
                    // { name: "All", value: "all" },
                    { name: "Noor", value: "noor" },
                    { name: "Zara", value: "zara" },
                    { name: "Rune", value: "rune" },
                    { name: "Amara", value: "amara" },
                    { name: "Viella", value: "viella" },
                    { name: "Shop By Quotes", value: "quotes" },
                    { name: "Wishlist", value: "wishlist" },
                  ].map((collection) => (
                    <button
                      key={collection.value}
                      onClick={() => setSelectedCollection(collection.value)}
                      className={`px-5 py-2 rounded-full border text-sm tracking-wide transition-all

      ${
        selectedCollection === collection.value
          ? "border-primary text-primary shadow-[0_0_10px_hsl(43_45%_59%_/_0.3)]"
          : "border-primary/20 text-foreground/60 hover:border-primary"
      }

      `}
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCollection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {selectedCollection === "wishlist" &&
                    filteredProducts.length === 0 ? (
                      <div className="text-center py-16">
                        <Star className="w-16 h-16 text-primary/30 mx-auto mb-6" />
                        <h3 className="text-xl font-light text-primary mb-3">
                          Your wishlist is empty
                        </h3>
                        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                          Save candles to personalize your gift.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/shop")}
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          Browse Candles
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedCandle(product)}
                            className={`cursor-pointer group relative overflow-hidden rounded-sm transition-all duration-500 ${
                              selectedCandle?.id === product.id
                                ? "ring-2 ring-primary shadow-[0_0_30px_hsl(43_45%_59%_/_0.3)]"
                                : "hover:shadow-lg"
                            }`}
                          >
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-lg font-light tracking-wide text-primary">
                                {product.name}
                              </h3>
                              <p className="text-sm text-foreground/60">
                                {product.fragrance}
                              </p>
                            </div>
                            {selectedCandle?.id === product.id && (
                              <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <Check
                                  size={16}
                                  className="text-primary-foreground"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* LABEL QUOTE SECTION */}

                {selectedCandle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 max-w-2xl mx-auto"
                  >
                    <h3 className="text-primary text-xl mb-4 text-center tracking-wide">
                      Add Custom Label Quote (+₹10)
                    </h3>

                    <div className="luxury-card p-8">
                      <Textarea
                        value={labelQuote}
                        onChange={(e) => {
                          setLabelQuote(e.target.value);

                          setLabelQuoteSubmitted(false);
                        }}
                        placeholder="Write your candle label message..."
                        className="min-h-[120px] bg-background border-primary/20"
                      />

                      <Button
                        onClick={handleSubmitLabelQuote}
                        disabled={!labelQuote.trim()}
                        className="w-full mt-6"
                      >
                        {labelQuoteSubmitted ? (
                          <>
                            <Check size={18} /> Saved (+₹10)
                          </>
                        ) : (
                          "Submit Label Quote"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Select Premium Box */}
            {currentStep === 1 && (
              <motion.div
                key="step-box"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
                    Select Premium Box
                  </h2>
                  <p className="text-foreground/60 font-light">
                    Choose elegant packaging for your gift
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
                  {premiumBoxes.map((box) => (
                    <motion.div
                      key={box.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedBox(box)}
                      className={`cursor-pointer group relative overflow-hidden rounded-sm transition-all duration-500 ${
                        selectedBox?.id === box.id
                          ? "ring-2 ring-primary shadow-[0_0_30px_hsl(43_45%_59%_/_0.3)]"
                          : "hover:shadow-lg"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-charcoal-light">
                        <img
                          src={box.image}
                          alt={box.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                        />
                      </div>
                      <div className="p-4 bg-charcoal-light">
                        <h3 className="text-base font-light tracking-wide text-primary">
                          {box.name}
                        </h3>
                        <p className="text-lg text-primary/80 mt-1">
                          {box.price === 0 ? "Free" : `+₹${box.price}`}
                        </p>
                      </div>
                      {selectedBox?.id === box.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Check
                            size={16}
                            className="text-primary-foreground"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Spotify Card */}
            {currentStep === 2 && (
              <motion.div
                key="step-spotify"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
                    Select Spotify Card
                  </h2>
                  <p className="text-foreground/60 font-light">
                    Add a personalized music experience
                  </p>
                </div>

                <div className="flex justify-center items-end gap-10 max-w-4xl mx-auto">
                  {spotifyCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSelectedSpotify(card);
                        if (card.id === "spotify4") {
                          setShowSpotifyPopup(true);
                        }
                      }}
                      className={`w-[260px] md:w-[300px] cursor-pointer group relative overflow-hidden rounded-sm transition-all duration-500 luxury-card
${
  selectedSpotify?.id === card.id
    ? "ring-2 ring-primary shadow-[0_0_30px_hsl(43_45%_59%_/_0.3)]"
    : ""
}
`}
                    >
                      <div className="h-[260px] overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 text-center">
                        <Music className="w-6 h-6 text-primary mx-auto mb-2" />
                        <h3 className="text-sm font-light tracking-wide text-primary text-center">
                          {card.name}
                        </h3>
                        <p className="text-lg text-primary/80 mt-3">
                          {card.price === 0 ? "Free" : `+₹${card.price}`}
                        </p>
                      </div>
                      {selectedSpotify?.id === card.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Check
                            size={16}
                            className="text-primary-foreground"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {showSpotifyPopup && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-background border border-primary/20 p-8 rounded-lg w-[400px]">
                  <h3 className="text-xl text-primary mb-4 text-center">
                    Add Spotify Playlist
                  </h3>

                  <input
                    type="text"
                    placeholder="Paste Spotify playlist link..."
                    value={spotifyLink}
                    onChange={(e) => setSpotifyLink(e.target.value)}
                    className="w-full p-3 border border-primary/20 bg-background mb-6"
                  />

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowSpotifyPopup(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={() => {
                        if (!spotifyLink.trim()) return;

                        setShowSpotifyPopup(false);
                      }}
                    >
                      Save Playlist
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Write Your Message */}
            {currentStep === 3 && (
              <motion.div
                key="step-quotes"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
                    Write a Message for Your Candle
                  </h2>
                  <p className="text-foreground/60 font-light">
                    Add a heartfelt personalized message
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  {/* Main Input Section */}
                  <div className="luxury-card p-8 mb-8">
                    <div className="relative">
                      <Textarea
                        value={customQuote}
                        onChange={(e) => {
                          if (e.target.value.length <= MAX_QUOTE_LENGTH) {
                            setCustomQuote(e.target.value);
                            setQuoteSubmitted(false);
                          }
                        }}
                        placeholder="Write something meaningful, romantic, funny, or heartfelt…"
                        className="min-h-[150px] bg-background border-primary/20 focus:border-primary text-foreground resize-none"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-foreground/40">
                          {customQuote.length}/{MAX_QUOTE_LENGTH} characters
                        </span>
                        <span className="text-sm text-primary/80">
                          +₹{QUOTES_PRICE}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="luxury"
                      size="lg"
                      onClick={handleSubmitQuote}
                      disabled={!customQuote.trim()}
                      className="w-full mt-6"
                    >
                      {quoteSubmitted ? (
                        <>
                          <Check size={18} className="mr-2" />
                          Message Saved
                        </>
                      ) : (
                        "Submit Quote"
                      )}
                    </Button>
                  </div>

                  {/* Suggestion Cards */}
                  <div className="space-y-4">
                    <p className="text-center text-foreground/50 text-sm uppercase tracking-wider">
                      Need inspiration? Try one of these
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestedQuotes.map((quote, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCustomQuote(quote);
                            setQuoteSubmitted(false);
                          }}
                          className="p-4 text-left luxury-card hover:border-primary/30 transition-all duration-300"
                        >
                          <Quote className="w-4 h-4 text-primary/60 mb-2" />
                          <p className="text-foreground/80 font-light italic">
                            "{quote}"
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* STEP 5 FLOWER */}

            {currentStep === 4 && (
              <motion.div
                key="flower-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary">
                    Select Flower Bouquet
                  </h2>

                  <p className="text-foreground/60">
                    Add Luxury Flowers (+₹300)
                  </p>
                </div>

                {/* BLURRED CONTENT */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 blur-sm pointer-events-none">
                  {flowerOptions.map((flower) => (
                    <motion.div
                      key={flower.id}
                      className="luxury-card overflow-hidden opacity-60"
                    >
                      <img
                        src={flower.image}
                        className="aspect-square object-cover"
                      />

                      <div className="p-4">
                        <h3 className="text-primary">{flower.name}</h3>
                        <p>+₹300</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* COMING SOON OVERLAY */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="px-10 py-6 rounded-lg border border-primary/40 
        backdrop-blur-md bg-black/50 text-center"
                  >
                    <motion.h3
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-primary text-2xl tracking-[0.25em]"
                    >
                      COMING SOON
                    </motion.h3>

                    <p className="text-foreground/60 mt-3 text-sm tracking-wider">
                      Luxury Flower Bouquets Launching Soon
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
                    Review Your Selection
                  </h2>
                  <p className="text-foreground/60 font-light">
                    Your personalized gift is ready
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="luxury-card p-8">
                    {/* Selected Candle */}
                    {selectedCandle && (
                      <div className="flex items-center gap-6 pb-6 border-b border-primary/10">
                        <img
                          src={selectedCandle.image}
                          alt={selectedCandle.name}
                          className="w-24 h-24 object-cover rounded-sm"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg text-primary font-light tracking-wide">
                            {selectedCandle.name}
                          </h3>
                          <p className="text-sm text-foreground/60">
                            {selectedCandle.fragrance}
                          </p>
                        </div>
                        <p className="text-primary text-lg">
                          ₹{selectedCandle.price.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Customizations */}
                    <div className="py-6 space-y-4">
                      {labelQuoteSubmitted && labelQuote.trim() && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Quote className="w-5 h-5 text-primary/60" />

                              <span className="text-foreground/80">
                                Candle Label Message
                              </span>
                            </div>

                            <span className="text-primary">
                              +₹{LABEL_QUOTE_PRICE}
                            </span>
                          </div>

                          <div className="ml-8 p-3 bg-primary/5 border border-primary/10 rounded-sm">
                            <p className="text-primary font-light italic text-sm">
                              "{labelQuote}"
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedBox && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Gift className="w-5 h-5 text-primary/60" />
                            <span className="text-foreground/80">
                              {selectedBox.name}
                            </span>
                          </div>
                          <span className="text-primary">
                            {selectedSpotify.price === 0
                              ? "Free"
                              : `+₹${selectedSpotify.price}`}
                          </span>
                        </div>
                      )}
                      {selectedSpotify && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Music className="w-5 h-5 text-primary/60" />
                            <span className="text-foreground/80">
                              {selectedSpotify.name}
                            </span>
                          </div>
                          <span className="text-primary">
                            {selectedSpotify.price === 0
                              ? "Free"
                              : `+₹${selectedSpotify.price}`}
                          </span>
                        </div>
                      )}
                      {quoteSubmitted && customQuote.trim() && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Quote className="w-5 h-5 text-primary/60" />
                              <span className="text-foreground/80">
                                Personalized Message
                              </span>
                            </div>
                            <span className="text-primary">
                              +₹{QUOTES_PRICE}
                            </span>
                          </div>
                          <div className="ml-8 p-3 bg-primary/5 border border-primary/10 rounded-sm">
                            <p className="text-primary font-light italic text-sm">
                              "{customQuote}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-6 border-t border-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-foreground/80 uppercase tracking-wider">
                          Total
                        </span>
                        <span className="text-2xl text-primary font-light">
                          ₹{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                  >
                    <Button
                      variant="heroFilled"
                      size="xl"
                      onClick={handleAddToCart}
                      className="w-full max-w-sm"
                    >
                      Add to Cart
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-primary/10 py-4 px-6">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-wider">
                Current Total
              </p>
              <p className="text-xl text-primary font-light">
                ₹{calculateTotal().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Skip
              </Button>

              <Button
                variant="luxury"
                size="lg"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="min-w-[160px]"
              >
                Next Step
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizeJourney;
