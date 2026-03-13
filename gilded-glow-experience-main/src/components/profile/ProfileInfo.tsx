import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/Authcontext";
import { Crown } from "lucide-react";

const ProfileInfo = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tier system
  const tierInfo = {
    1: { name: "Ember Tier", icon: "" },
    2: { name: "Velvet Tier", icon: "" },
    3: { name: "Obsidian Tier", icon: "" },
  };

  const currentTier = tierInfo[user?.tier || 1];

  useEffect(() => {
    fetch("https://backend-wghd.onrender.com/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("PROFILE DATA:", data);
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load profile", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-foreground/60">Loading profile...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">Profile Information</h2>

      <div className="space-y-3">
        <p>
          <span className="text-primary">Name:</span> {profile?.name || "N/A"}
        </p>

        <p>
          <span className="text-primary">Email:</span> {profile?.email || "N/A"}
        </p>

        <p>
          <span className="text-primary">Phone:</span>{" "}
          {profile?.phone || "Not provided"}
        </p>

        <p>
          <span className="text-primary">Sparks:</span>{" "}
          {profile?.rewardPoints || 0}
        </p>

        {/* Tier Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-primary/40 text-primary text-sm tracking-wide">
          <span className="text-lg">{currentTier.icon}</span>
          <span>{currentTier.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
