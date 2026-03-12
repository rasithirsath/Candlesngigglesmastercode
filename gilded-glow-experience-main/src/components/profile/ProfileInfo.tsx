import { useEffect, useState } from "react";

const ProfileInfo = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://backend-jdug.onrender.com/api/user/profile", {
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
      </div>
    </div>
  );
};

export default ProfileInfo;
