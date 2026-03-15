import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/Authcontext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizationsTotal?: number;
}
const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const { user, loginUser } = useAuth();
  const location = useLocation();
  const redeemPoints = location.state?.redeemPoints || false;

  // Calculate totals including customizations
  const cartBaseTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const addOnsTotal = cart.reduce(
    (sum, item) =>
      sum + ((item as CartItem).customizationsTotal || 0) * item.quantity,
    0,
  );
  const deliveryFee = cartBaseTotal >= 1000 ? 0 : 40;
  const pointsDiscount =
    redeemPoints && user && user.rewardPoints >= 1000 ? 1000 : 0;
  const grandTotal = cartBaseTotal + addOnsTotal + deliveryFee - pointsDiscount;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is logged in using useEffect to avoid navigation during render
  useEffect(() => {
    if (!user) {
      toast.error("Please sign up or login to complete your purchase");
      navigate("/auth", { state: { from: location } });
    }
  }, [user, navigate, location]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Invalid pincode";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Get auth token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

    // 1️⃣ Create order from backend
    const orderRes = await fetch(
      "https://backend-wghd.onrender.com/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: grandTotal }),
      },
    );

    const order = await orderRes.json();

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: "rzp_live_SFJSDKFNsb4CKO",
      amount: order.amount,
      currency: "INR",
      name: "Candles & Giggles",
      description: "Luxury Candle Purchase",
      order_id: order.id,

      handler: async function (response) {
        console.log("PAYMENT SUCCESS:", response);
      },

      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },

      notes: {
        source: "candlesngiggles.com",
      },

      theme: {
        color: "#c9a24d",
      },
    };
    console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 text-center">
          <p className="text-foreground/60 font-light text-lg mb-8">
            Your cart is empty
          </p>
          <Button variant="luxuryOutline" onClick={() => navigate("/shop")}>
            Shop Candles
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-primary mb-4">
              Checkout
            </h1>
            <div className="luxury-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <h2 className="text-xl font-light tracking-[0.1em] text-primary mb-6">
                Delivery Details
              </h2>

              {["fullName", "phone", "email", "address", "city", "pincode"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <Label
                      htmlFor={field}
                      className="text-foreground/70 font-light capitalize"
                    >
                      {field === "fullName"
                        ? "Full Name"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className="bg-card border-primary/20 focus:border-primary"
                    />
                    {errors[field] && (
                      <p className="text-destructive text-sm">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ),
              )}

              <Button
                type="submit"
                variant="heroFilled"
                className="w-full mt-8"
              >
                Pay Now — ₹{grandTotal.toLocaleString()}
              </Button>
            </motion.form>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="luxury-card p-8">
                <h2 className="text-xl font-light tracking-[0.1em] text-primary mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const itemTotal =
                      (item.price +
                        ((item as CartItem).customizationsTotal || 0)) *
                      item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between text-foreground/70 font-light"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{itemTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}

                  {addOnsTotal > 0 && (
                    <div className="flex justify-between text-foreground/70 font-light">
                      <span>Add-ons</span>
                      <span>₹{addOnsTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-foreground/70 font-light">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-foreground/70 font-light">
                      <span>Points Redemption (1,000 pts)</span>
                      <span>-₹{pointsDiscount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="luxury-divider mb-6" />
                <div className="flex justify-between text-lg text-primary font-light">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
