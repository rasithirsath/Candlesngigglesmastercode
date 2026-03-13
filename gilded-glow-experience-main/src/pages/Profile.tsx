import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/Authcontext";
import ProfileInfo from "@/components/profile/ProfileInfo";
import Orders from "@/components/profile/Orders";
import Rewards from "@/components/profile/Rewards";
import Reviews from "@/components/profile/MyReviews";
import Wishlist from "@/components/profile/Wishlist";
const Profile = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
          {/* Sidebar */}

          <div className="luxury-card p-4 md:p-6 flex md:flex-col gap-3 md:gap-4 overflow-x-auto">
            <button
              className="whitespace-nowrap text-left md:w-full hover:text-primary px-2 py-1"
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </button>

            <button
              className="whitespace-nowrap text-left md:w-full hover:text-primary px-2 py-1"
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>

            <button
              className="whitespace-nowrap text-left md:w-full hover:text-primary px-2 py-1"
              onClick={() => setActiveTab("rewards")}
            >
              My Rewards
            </button>

            <button
              className="whitespace-nowrap text-left md:w-full hover:text-primary px-2 py-1"
              onClick={() => setActiveTab("reviews")}
            >
              My Reviews
            </button>

            <button
              className="whitespace-nowrap text-left md:w-full hover:text-primary px-2 py-1"
              onClick={logout}
            >
              Logout
            </button>
          </div>

          {/* Content */}

          <div className="md:col-span-3 luxury-card p-5 md:p-8">
            {activeTab === "profile" && <ProfileInfo user={user} />}

            {activeTab === "orders" && <Orders />}

            {activeTab === "rewards" && <Rewards />}

            {activeTab === "reviews" && <Reviews />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
