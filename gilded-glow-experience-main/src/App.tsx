import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/Authcontext";
import { StoreProvider } from "@/contexts/StoreContext";

import ScrollToTop from "@/components/ScrollToTop";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Rewards from "./pages/Rewards";
import CustomizeJourney from "./pages/CustomizeJourney";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import BestSellers from "./pages/BestSellers";

import Dashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Products from "./admin/Products";
import CustomerDetails from "./admin/CustomerDetails";
import AdminRoute from "./admin/AdminRoute";

const queryClient = new QueryClient();

const AdminRedirect = ({ children }: any) => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            {/* FIX: ScrollToTop must be here */}
            <ScrollToTop />

            <Routes>
              <Route
                path="/"
                element={
                  <AdminRedirect>
                    <Index />
                  </AdminRedirect>
                }
              />

              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz-result" element={<QuizResult />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/customize" element={<CustomizeJourney />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/best-sellers" element={<BestSellers />} />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/customer/:id" element={<CustomerDetails />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
