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
        <div className="container mx-auto max-w-6xl grid grid-cols-4 gap-10">
          {/* Sidebar */}

          <div className="luxury-card p-6 flex flex-col gap-4">
            <button
              className="text-left w-full hover:text-primary"
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </button>

            <button
              className="text-left w-full hover:text-primary"
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>

            <button
              className="text-left w-full hover:text-primary"
              onClick={() => setActiveTab("rewards")}
            >
              My Rewards
            </button>

            <button
              className="text-left w-full hover:text-primary"
              onClick={() => setActiveTab("reviews")}
            >
              My Reviews
            </button>

            <button
              className="text-left w-full hover:text-primary"
              onClick={logout}
            >
              Logout
            </button>
          </div>

          {/* Content */}

          <div className="col-span-3 luxury-card p-8">
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
