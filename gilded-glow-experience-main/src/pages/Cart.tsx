import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Music,
  Quote,
  Gift,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/Authcontext";
import { toast } from "sonner";

import candle1 from "@/assets/candle-1.jpeg";
import candle2 from "@/assets/candle-2.jpeg";
import candle3 from "@/assets/candle-3.jpeg";
import candle4 from "@/assets/candle-4.jpeg";

const imageMap: Record<string, string> = {
  "/candle-1.jpg": candle1,
  "/candle-2.jpg": candle2,
  "/candle-3.jpg": candle3,
  "/candle-4.jpg": candle4,
};

const customizationLabels: Record<string, { name: string; icon: LucideIcon }> =
  {
    spotify: { name: "Spotify Card", icon: Music },

    quotes: { name: "Personalized Message", icon: Quote },

    giftbox: { name: "Premium Gift Box", icon: Gift },

    labelQuote: { name: "Candle Label Message", icon: Quote },

    flower: { name: "Flower Bouquet", icon: Gift },
  };

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);

  // Calculate total including customizations
  const customizationsTotal = cart.reduce((total, item) => {
    return total + ((item as any).customizationsTotal || 0) * item.quantity;
  }, 0);

  const deliveryFee = cartTotal >= 1000 ? 0 : 40;
  const pointsDiscount =
    redeemPoints && user && user.rewardPoints >= 1000 ? 1000 : 0;
  const grandTotal =
    cartTotal + customizationsTotal + deliveryFee - pointsDiscount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.15em] text-primary mb-4">
              Your Cart
            </h1>
            <div className="luxury-divider mt-6" />
          </motion.div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <ShoppingBag size={64} className="mx-auto text-primary/30 mb-8" />
              <p className="text-xl text-foreground/60 font-light mb-8">
                Your cart is empty. Let's fill it with warmth.
              </p>
              <Link to="/shop">
                <Button variant="luxuryOutline" size="lg">
                  Shop Candles
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item, index) => {
                  const imageSrc = item.image?.startsWith("http")
                    ? item.image
                    : imageMap[item.image] || candle1;

                  const itemCustomizations = (item as any).customizations || [];
                  const itemCustomizationsTotal =
                    (item as any).customizationsTotal || 0;
                  const itemTotal =
                    (item.price + itemCustomizationsTotal) * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="luxury-card p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                        {/* Product Image */}
                        <Link to={`/product/${item.id}`} className="shrink-0">
                          <div className="w-full sm:w-24 h-40 sm:h-24 overflow-hidden rounded-sm">
                            <img
                              src={imageSrc}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2 w-full">
                          <h3 className="text-lg font-light tracking-[0.1em] text-primary">
                            {(item as any).selectedFragrance || item.fragrance}
                          </h3>

                          <p className="text-foreground/60 text-sm font-light">
                            ₹{(item.price || 0).toLocaleString()}
                          </p>

                          {(item as any).selectedFragrance && (
                            <p className="text-xs text-foreground/50 font-light">
                              Fragrance: {(item as any).selectedFragrance}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between sm:justify-start gap-4 mt-3">
                            <div className="flex items-center gap-2 border border-primary/20 rounded-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 hover:bg-primary/10 transition-colors"
                              >
                                <Minus size={14} className="text-primary" />
                              </button>

                              <span className="w-8 text-center text-foreground/80">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-primary/10 transition-colors"
                              >
                                <Plus size={14} className="text-primary" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-foreground/40 hover:text-destructive transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right sm:text-right mt-2 sm:mt-0">
                          <p className="text-lg font-light text-primary">
                            ₹{(itemTotal || 0).toLocaleString()}
                          </p>

                          {itemCustomizationsTotal > 0 && (
                            <p className="text-xs text-foreground/50 font-light">
                              incl. ₹
                              {(
                                itemCustomizationsTotal * item.quantity
                              ).toLocaleString()}{" "}
                              add-ons
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                {/* Reward Points Card */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="text-primary" size={20} />
                          <h3 className="text-sm font-light tracking-[0.15em] text-primary/70 uppercase">
                            Reward Points
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-light text-primary tracking-tight">
                            {user.rewardPoints || 0}
                          </span>
                          <span className="text-sm text-foreground/50 font-light">
                            points
                          </span>
                        </div>
                        <p className="text-xs text-foreground/50 font-light mt-3">
                          Earn 1 point for every ₹1 spent
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Order Summary Card */}
                <div className="luxury-card p-6 sm:p-8 lg:sticky lg:top-32">
                  <h3 className="text-xl font-light tracking-[0.1em] text-primary mb-6">
                    Order Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-foreground/60 font-light">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    {customizationsTotal > 0 && (
                      <div className="flex justify-between text-foreground/60 font-light">
                        <span>Customizations</span>
                        <span>₹{customizationsTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground/60 font-light">
                      <span>Delivery</span>
                      <span>
                        {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-primary/60">
                        Add ₹{(1000 - cartTotal).toLocaleString()} more for free
                        delivery
                      </p>
                    )}
                  </div>

                  {/* Points Redemption Checkbox */}
                  {/* {user && user.rewardPoints >= 1000 && cartTotal > 1000 && (
                    <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="redeem-points"
                          checked={redeemPoints}
                          onCheckedChange={(checked) =>
                            setRedeemPoints(checked as boolean)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="redeem-points"
                            className="text-sm font-light text-foreground cursor-pointer"
                          >
                            Redeem 1,000 points for ₹1,000 discount
                          </label>
                          <p className="text-xs text-foreground/50 font-light mt-1">
                            You have {user.rewardPoints.toLocaleString()} points
                            available
                          </p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  <div className="luxury-divider mb-6" />
                  <div className="space-y-3 mb-6">
                    {pointsDiscount > 0 && (
                      <div className="flex justify-between text-sm text-primary/80 font-light">
                        <span>Points Redemption</span>
                        <span>-₹{pointsDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg text-primary font-light">
                      <span>Total</span>
                      <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="heroFilled"
                    className="w-full"
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                      } else {
                        navigate("/checkout", { state: { redeemPoints } });
                      }
                    }}
                  >
                    Continue to Checkout
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <AlertDialogContent className="bg-background border-primary/20 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-light tracking-widest text-primary text-center">
              SIGN IN REQUIRED
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60 font-light text-center pt-4">
              Please sign in or create an account to complete your purchase and
              earn reward points.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="luxury-divider my-6" />
          <AlertDialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/auth", {
                  state: { from: { pathname: "/checkout" }, mode: "login" },
                });
              }}
            >
              Log In to My Account
            </Button>
            <Button
              variant="luxuryOutline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                setShowAuthModal(false);
                navigate("/auth", {
                  state: { from: { pathname: "/checkout" }, mode: "signup" },
                });
              }}
            >
              <Sparkles size={16} />
              Create New Account (+10 Points)
            </Button>
            <AlertDialogCancel className="w-full border-none text-foreground/40 hover:text-foreground/60 hover:bg-transparent transition-colors">
              Continue Shopping
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Cart;
