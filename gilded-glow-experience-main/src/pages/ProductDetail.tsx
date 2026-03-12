import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Clock,
  Flame,
  ArrowLeft,
  Music,
  Quote,
  Gift,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useAuth } from "@/contexts/Authcontext";
const collectionFragrances: Record<string, string[]> = {
  noor: ["Rose & Oud"],

  zara: ["Mon Amour"],

  rune: ["Black Earth"],

  amara: ["A Million Wishes"],

  viella: ["Lavender Flower & Vanilla"],
  quotes: [
    "Neroli Blanc (Neroli) ",

    "Bleu Marine (Ocean) ",

    "The Botanique (Tea Tree) ",

    "Vanille Noire (Vanilla) ",

    "Oud Imperial (Oudh) ",

    "Jasmine De Nuit (Jasmine) ",

    "Orchard Verte (Green Apple) ",

    "Ambre Mystique (Amber) ",

    "Eucalyptus Glace (Eucalyptus) ",

    "Santal Dore (Sandalwood)",
  ],
};

const customizationOptions = [
  {
    id: "spotify",
    name: "Spotify Card",
    description: "Add a personalized Spotify playlist card",
    price: 20,
    icon: Music,
  },
  {
    id: "quotes",
    name: "Quotes Card",
    description: "Include a beautiful quote card",
    price: 20,
    icon: Quote,
  },
  {
    id: "giftbox",
    name: "Premium Gift Box",
    description: "Luxury packaging with ribbon",
    price: 249,
    icon: Gift,
  },
];

const ProductDetail = () => {
  const { addRewardPoints } = useAuth();
  const { id } = useParams<{ id: string }>();
  const {
    products,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useStore();

  const product = products.find((p) => p.id === id);
  const fragrances =
    collectionFragrances[product?.collection || "quotes"] || [];
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    string[]
  >([]);
  // ⭐ Reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState("");

  useEffect(() => {
    if (product?.fragrance) {
      setSelectedFragrance(product.fragrance);
    }
  }, [product]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://backend-wghd.onrender.com/api/reviews/${product.id}`,
        );

        const data = await res.json();

        setReviews(data);
      } catch (err) {
        console.log("Failed to load reviews");
      }
    };

    if (product) fetchReviews();
  }, [product]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  const toggleCustomization = (id: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const customizationsTotal = selectedCustomizations.reduce((total, cid) => {
    const opt = customizationOptions.find((o) => o.id === cid);
    return total + (opt?.price || 0);
  }, 0);

  const totalPrice = product.price + customizationsTotal;

  const handleAddToCart = () => {
    if (!selectedFragrance) {
      toast.error("Please select a fragrance");
      return;
    }

    const selectedCustomizationObjects = selectedCustomizations.map((cid) => {
      const option = customizationOptions.find((o) => o.id === cid);
      return {
        id: option?.id,
        name: option?.name,
        price: option?.price,
      };
    });

    addToCart({
      ...product,
      selectedFragrance,
      customizations: selectedCustomizationObjects,
      customizationsTotal,
    });

    toast.success("Added to cart ✨");
  };
  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to write a review");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-wghd.onrender.com/api/reviews/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            rating,
            comment: reviewText,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setReviews([data.review, ...reviews]);

        setReviewText("");

        addRewardPoints(data.reward); // ⭐ ADD THIS LINE

        toast.success(`Review posted! +${data.reward} Sparks 🔥`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link to="/shop" className="flex items-center gap-2 mb-12">
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            <div>
              {/* FRAGRANCE */}
              <div className="mb-6">
                <label className="block mb-2 text-sm">Select Fragrance</label>
                <div className="relative">
                  <select
                    value={selectedFragrance}
                    onChange={(e) => setSelectedFragrance(e.target.value)}
                    className="w-full border rounded px-4 py-3 appearance-none bg-background"
                  >
                    <option value="">Choose a fragrance</option>

                    {fragrances.map((fragrance) => (
                      <option key={fragrance} value={fragrance}>
                        {fragrance}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {product.originalPrice && (
                  <span className="text-lg text-foreground/40 line-through">
                    ₹
                    {(
                      product.originalPrice + customizationsTotal
                    ).toLocaleString()}
                  </span>
                )}

                <span className="text-3xl text-primary font-light">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 border p-4 rounded">
                  <Flame size={18} /> {selectedFragrance}
                </div>
                <div className="flex items-center gap-3 border p-4 rounded">
                  <Clock size={18} /> {product.burnTime}
                </div>
              </div>

              {/* CUSTOMIZATION */}
              <h3 className="mb-4 text-lg">Customize</h3>

              <div className="space-y-3 mb-8">
                {customizationOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = selectedCustomizations.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleCustomization(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 border rounded transition ${
                        active ? "border-primary bg-primary/10" : ""
                      }`}
                    >
                      {active ? <Check /> : <Icon />}
                      <div className="flex-1 text-left">
                        <p>{opt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {opt.description}
                        </p>
                      </div>
                      <span>+₹{opt.price}</span>
                    </button>
                  );
                })}
              </div>

              <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingBag size={18} /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
        {/* ================= REVIEWS ================= */}

        <div className="luxury-card p-10 mt-20">
          <h2 className="text-2xl text-primary mb-8">Customer Reviews</h2>

          {/* REVIEW FORM */}

          <div className="border p-6 rounded mb-10">
            <h3 className="mb-4">Write a Review</h3>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <span
                    className={
                      star <= rating
                        ? "text-primary text-xl"
                        : "text-gray-500 text-xl"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-black border border-primary/30 
focus:border-primary outline-none text-foreground 
placeholder:text-foreground/40 p-4 min-h-[120px]"
            />

            <Button
              variant="heroFilled"
              className="mt-4 px-8 tracking-[0.2em]"
              onClick={handleSubmitReview}
            >
              Submit Review
            </Button>
          </div>

          {/* REVIEW LIST */}

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 4000 }}
            className="mt-12"
          >
            {reviews.map((r) => (
              <SwiperSlide key={r._id}>
                <div className="luxury-card p-8 text-center max-w-3xl mx-auto">
                  <div className="flex justify-center mb-4 text-primary text-xl">
                    {"★".repeat(r.rating)}
                  </div>

                  <p className="text-foreground/70 italic leading-relaxed mb-4">
                    "{r.comment}"
                  </p>

                  <p className="text-primary text-sm tracking-widest">
                    — {r.userId?.name || "Anonymous"}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
