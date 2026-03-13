import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { signup, login } from "@/utils/api";
import { useAuth } from "@/contexts/Authcontext";
import { Star } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const from = location.state?.from?.pathname || "/";
  const initialMode = location.state?.mode !== "signup";

  const [isLogin, setIsLogin] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = isLogin
        ? await login({
            email: formData.email,
            password: formData.password,
          })
        : await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
      console.log("LOGIN RESPONSE:", response);

      loginUser(response.token, response.user);

      if (isLogin) {
        toast.success("Welcome back!");

        // ADMIN REDIRECT
        if (response.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        // Show welcome modal for new signups
        setShowWelcomeModal(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-primary mb-4">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-foreground/60 font-light">
              {isLogin
                ? "Sign in to access your account"
                : "Create an account to continue"}
            </p>
            <div className="luxury-divider mt-6" />
          </div>

          <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="heroFilled" className="w-full">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            <p className="text-center text-foreground/60 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </motion.div>
      </main>

      {/* ================= WELCOME MODAL ================= */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="luxury-card p-10 w-full max-w-md text-center bg-background relative"
          >
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star size={40} className="text-primary fill-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-primary mb-4">
                Welcome!
              </h2>
              <p className="text-foreground/80 text-lg mb-2">
                You've been rewarded with
              </p>
              <p className="text-4xl font-light text-primary mb-4">
                100 Reward Points!
              </p>
              <p className="text-foreground/60 text-sm">
                Shop candles to earn more points for excellent rewards
              </p>
            </div>
            <Button
              onClick={() => {
                setShowWelcomeModal(false);
                navigate(from, { replace: true });
              }}
              variant="heroFilled"
              className="w-full"
            >
              OK
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Auth;
