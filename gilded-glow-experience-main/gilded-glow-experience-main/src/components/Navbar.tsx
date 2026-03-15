import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { useAuth } from "@/contexts/Authcontext";
import { NavLink } from "@/components/NavLink";
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const location = useLocation();

  const { cartCount, wishlist } = useStore();
  const { user, logout } = useAuth();

  const rewardPoints = user?.rewardPoints ?? 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Best Seller", path: "/best-sellers" },
  ];

  const rightLinks = [
    { name: "Quiz", path: "/quiz" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "navbar-glass border-b border-primary/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Desktop Left Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="text-sm uppercase tracking-[0.2em] text-foreground/80 transition-colors duration-500 font-light"
                  activeClassName="text-primary"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-primary p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex justify-center">
              <Link to="/" className="group">
                <img
                  src="/logo/candlesngiggles-logo.png"
                  alt="candlesngiggles logo"
                  className="h-20 md:h-20 w-25 transition-all duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center justify-end gap-6">
              {rightLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="text-sm uppercase tracking-[0.2em] text-foreground/80 transition-colors duration-500 font-light"
                  activeClassName="text-primary"
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Rewards */}
              {user && (
                <Link
                  to="/rewards"
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 hover:border-primary/60 transition-all duration-300 whitespace-nowrap"
                >
                  <img
                    src="/logo/flame-g.png"
                    alt="Rewards"
                    className="w-5 h-5 object-contain flex-shrink-0"
                  />

                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-sm text-primary font-light leading-none flex items-center"
                  >
                    {rewardPoints}
                  </motion.span>
                </Link>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <Heart
                  size={20}
                  className="text-foreground/80 group-hover:text-primary hover:scale-110 transition-all duration-300"
                />

                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <ShoppingBag
                  size={20}
                  className="text-foreground/80 group-hover:text-primary hover:scale-110 transition-all duration-300"
                />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon */}
              {user && (
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/profile"}
                >
                  <User className="w-5 h-5 text-primary hover:text-white hover:scale-110 transition-all duration-300" />
                </Link>
              )}

              {/* Auth Buttons */}
              {user ? (
                <Button
                  variant="nav"
                  size="sm"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  Logout
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="luxuryOutline" size="sm">
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center justify-end gap-3">
              {user && (
                <Link
                  to="/rewards"
                  className="flex items-center gap-1 px-2 py-1 border border-primary/20 rounded-full"
                >
                  <img src="/logo/flame-g.png" className="w-4 h-4" />

                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-xs text-primary"
                  >
                    {rewardPoints}
                  </motion.span>
                </Link>
              )}

              <Link to="/wishlist">
                <Heart size={20} className="text-foreground/80" />
              </Link>

              <Link to="/cart">
                <ShoppingBag size={20} className="text-foreground/80" />
              </Link>

              {user && (
                <Link to="/profile">
                  <User size={20} className="text-primary" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="md:hidden navbar-glass border-t border-primary/10"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                {[...navLinks, ...rightLinks].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-primary transition-colors duration-500 font-light py-2"
                  >
                    {link.name}
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      to="/profile"
                      className="text-sm uppercase tracking-[0.2em] hover:text-primary py-2"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/rewards"
                      className="flex items-center gap-2 py-2 text-sm"
                    >
                      <img src="/logo/flame-g.png" className="w-4 h-4" />
                      Rewards ({rewardPoints})
                    </Link>
                  </>
                )}

                {user ? (
                  <Button
                    variant="luxuryOutline"
                    className="w-full mt-4"
                    onClick={() => setIsLogoutDialogOpen(true)}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/auth" className="mt-4">
                    <Button variant="luxuryOutline" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Logout Dialog */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out or not now</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={() => logout()}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
