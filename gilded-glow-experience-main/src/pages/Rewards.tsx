import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Gift,
  ShoppingBag,
  Instagram,
  User,
  Pencil,
  Zap,
  X,
  Crown,
  Lock,
  Flame,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/Authcontext";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useEffect } from "react";
import sparkIcon from "../assets/flame-g.png";

const Rewards = () => {
  const { user, addRewardPoints } = useAuth();

  const rewardPoints = user?.rewardPoints || 0;
  const userTier = user?.tier || 1;
  // Tier thresholds
  const tierTwoThreshold = 4000;
  const tierThreeThreshold = 10000;

  const TIER2_UNLOCK = 5000;
  const TIER3_UNLOCK = 10000;

  const isTier2Unlocked = true;
  const isTier3Unlocked = true;

  // Max range for progress bar
  const maxPoints = tierThreeThreshold;

  // Calculate progress %
  const progressPercentage = userTier === 1 ? 10 : userTier === 2 ? 50 : 100;

  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const [birthdayName, setBirthdayName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const canUnlockObsidian = rewardPoints >= 4500;
  const canUnlockArchiveDrop = rewardPoints >= 6000;
  const canUnlockTimeCapsule = rewardPoints >= 8000;

  const [purchasedExperiences, setPurchasedExperiences] = useState([]);

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://backend-wghd.onrender.com/api/rewards/my-redemptions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (data.success) {
          setPurchasedExperiences(data.experiences);
        }
      } catch (err) {
        console.log("Failed to load redemptions");
      }
    };

    if (user) {
      fetchRedemptions();
    }
  }, [user]);

  const [birthdayCount, setBirthdayCount] = useState(0);

  const [instagramRewardClaimed, setInstagramRewardClaimed] = useState(false);
  const [confirmExperience, setConfirmExperience] = useState(null);

  const handleInstagramFollow = () => {
    if (instagramRewardClaimed) {
      toast.error("Instagram reward already claimed");
      return;
    }

    // ⭐ Give Sparks
    addRewardPoints(250);

    setInstagramRewardClaimed(true);

    toast.success("250 Sparks Added ");

    // ⭐ Open Instagram
    window.open("https://www.instagram.com/candlesngiggles/", "_blank");
  };

  const [eventCount, setEventCount] = useState(0);

  const handleBirthdaySubmit = () => {
    if (!birthdayName || !birthdayDate) {
      toast.error("Please fill all fields");
      return;
    }

    if (birthdayCount >= 2) {
      toast.error("You already added 2 birthdays. Redeem rewards to add more.");
      return;
    }

    // ✅ Add points
    addRewardPoints(200);

    // ✅ Increase only birthday count
    setBirthdayCount((prev) => prev + 1);

    toast.success("200 Sparks Added ");

    // Reset fields
    setBirthdayName("");
    setBirthdayDate(null);
    setShowBirthdayModal(false);
  };

  // Experience redemption
  const handleUnlockExperience = async (experience, sparks) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backend-wghd.onrender.com/api/rewards/redeem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            experienceName: experience,
            sparksRequired: sparks,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        const updatedUser = {
          ...user,
          rewardPoints: data.remainingPoints,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setPurchasedExperiences((prev) => [...prev, experience]);

        toast.success("Experience Unlocked ");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  const handleEventSubmit = () => {
    if (!eventName || !eventDate) {
      toast.error("Please fill all fields");
      return;
    }

    if (eventCount >= 2) {
      toast.error("Maximum Important Dates added. Redeem rewards to add more.");
      return;
    }

    // ✅ Add points
    addRewardPoints(200);

    // ✅ Increase only event count
    setEventCount((prev) => prev + 1);

    toast.success("200 Sparks Added ");

    // Reset fields
    setEventName("");
    setEventDate(null);
    setShowEventModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 md:pt-32 pb-20 md:pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* HERO */}

          <section className="relative mb-16 md:mb-24 overflow-hidden rounded-lg px-4 md:px-0">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/70" />
            </div>

            <div className="relative z-10 text-center py-20">
              <h1 className="text-3xl md:text-5xl text-primary mb-6">
                Giggle Points
              </h1>

              <p className="text-foreground/70 mb-10">
                Earn Sparks. Unlock Experiences.
              </p>

              {/* POINT CARD */}

              <div className="luxury-card inline-block px-8 md:px-12 py-5 md:py-6">
                <img
                  src={sparkIcon}
                  alt="Spark"
                  className="mx-auto w-5 h-10 mb-2"
                />

                <h2 className="text-4xl md:text-5xl text-primary">
                  {rewardPoints}
                </h2>

                <p>Your Sparks</p>
              </div>

              {!user && (
                <div className="flex justify-center gap-4 mt-8">
                  <Link to="/auth">
                    <Button variant="heroFilled">Signup</Button>
                  </Link>

                  <Link to="/auth">
                    <Button variant="luxuryOutline">Login</Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
          {/* ================= MEMBERSHIP PROGRESS ================= */}

          <section className="mb-20 md:mb-28 px-4 md:px-0">
            <h2 className="text-center text-xl md:text-3xl tracking-[0.2em] md:tracking-[0.25em] font-light text-primary mb-12 md:mb-16">
              YOUR PROGRESSION
            </h2>

            <div className="relative max-w-4xl mx-auto">
              {/* Crown Markers */}

              <div className="relative h-3 mb-6">
                {/* Tier 1 */}
                <div className="absolute left-0 -translate-x-1/2 flex gap-1">
                  <Crown size={20} className="text-primary" />
                </div>

                {/* Tier 2 */}
                <div
                  className="absolute -translate-x-1/2 flex gap-1"
                  style={{ left: `${(tierTwoThreshold / maxPoints) * 100}%` }}
                >
                  <Crown size={20} className="text-primary" />
                  <Crown size={20} className="text-primary" />
                </div>

                {/* Tier 3 */}
                <div
                  className="absolute -translate-x-1/2 flex gap-1"
                  style={{ left: `${(tierThreeThreshold / maxPoints) * 100}%` }}
                >
                  <Crown size={20} className="text-primary" />
                  <Crown size={20} className="text-primary" />
                  <Crown size={20} className="text-primary" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-primary/10 rounded-full relative">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </section>
          {/* ================= HOW IT WORKS ================= */}

          <section className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl tracking-[0.25em] font-light text-primary mb-6">
              HOW IT WORKS
            </h2>

            <div className="w-24 h-[1px] bg-primary/40 mx-auto mb-14" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {/* STEP 1 */}
              <div className="luxury-card p-8 text-center">
                <Flame className="mx-auto text-primary mb-4" size={30} />
                <h3 className="text-primary tracking-wide mb-2">Earn Sparks</h3>
                <p className="text-foreground/60 text-sm">
                  Every purchase and action adds to your status.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="luxury-card p-8 text-center">
                <Crown className="mx-auto text-primary mb-4" size={30} />
                <h3 className="text-primary tracking-wide mb-2">
                  Climb The Tiers
                </h3>
                <p className="text-foreground/60 text-sm">
                  Unlock deeper privileges as your Sparks grow.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="luxury-card p-8 text-center">
                <Lock className="mx-auto text-primary mb-4" size={30} />
                <h3 className="text-primary tracking-wide mb-2">
                  Unlock The Giggle Archive
                </h3>
                <p className="text-foreground/60 text-sm">
                  Members-only experiences and hidden drops.
                </p>
              </div>
            </div>
          </section>

          {/* VIP TIERS */}

          {/* ================= STATUS TIERS ================= */}

          <section className="mb-24">
            <h2 className="text-center text-3xl md:text-4xl tracking-[0.25em] font-light text-primary mb-16">
              STATUS TIERS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {/* ================= TIER ONE ================= */}
              <div className="luxury-card p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="text-primary" size={22} />
                  <h3 className="text-primary text-xl">Ember Tier</h3>
                </div>

                <p className="text-foreground/60 text-sm italic mb-6">
                  “For those who just stepped inside.”
                </p>

                <ul className="space-y-2 text-sm text-foreground/70 mb-8">
                  <li>• Earn 1 Spark per ₹1</li>
                  <li>• Access to The Giggle Archive</li>
                  <li>• Secret “Society Notes” email</li>
                </ul>
              </div>

              {/* ================= TIER TWO ================= */}
              <div className="luxury-card p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="text-primary" size={22} />
                  <Crown className="text-primary" size={22} />
                  <h3 className="text-primary text-xl">Velvet Circle</h3>
                </div>

                <p className="text-foreground/60 text-sm italic mb-6">
                  “For those who burn deeper.”
                </p>

                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Early Drop Access (24 hours)</li>
                  <li>• Birthday Gift</li>
                  <li>• Early Access to Collaborations</li>
                </ul>
              </div>

              {/* ================= TIER THREE ================= */}
              <div className="luxury-card p-8 relative">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="text-primary" size={22} />
                  <Crown className="text-primary" size={22} />
                  <Crown className="text-primary" size={22} />
                  <h3 className="text-primary text-xl">Obsidian Order</h3>
                </div>

                <p className="text-foreground/60 text-sm italic mb-6">
                  “For those who own the flame.”
                </p>

                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Free Shipping Always</li>
                  <li>• Priority Dispatch</li>
                  <li>• 1 Double Sparks Order / Month</li>
                  <li>• Early Access to Obsidian Series</li>
                  <li>• Annual Collector Gift</li>
                  <li>• Access to Private Members Page</li>
                  <li>• Private Drop Alerts (SMS / WhatsApp)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* VAULT */}
          {/* ================= THE GIGGLE ARCHIVE ================= */}

          <section className="mb-32">
            <h2 className="text-center text-3xl md:text-4xl tracking-[0.25em] font-light text-primary mb-16">
              THE GIGGLE ARCHIVE
            </h2>

            <div className="space-y-10">
              {/* ======================= TIER 1 ======================= */}

              <div className="luxury-card p-10">
                <h3 className="text-primary text-xl tracking-widest mb-8">
                  EMBER TIER ARCHIVE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {/* 🖤 OBSIDIAN */}

                  <div>
                    <h4 className="text-primary mb-3">The Obsidian Series</h4>

                    <p className="text-sm text-foreground/70 mb-3">
                      Black Label Secret Edition
                    </p>

                    <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                      <li>• Limited to 150 Members</li>

                      <li>• Not sold.</li>

                      <li>• Not advertised.</li>

                      <li>• Only unlocked.</li>
                    </ul>

                    <p className="text-primary mb-4">Redeem 4,500 Sparks</p>

                    <Button
                      className="px-8 py-4 whitespace-nowrap"
                      disabled={
                        rewardPoints < 4500 ||
                        purchasedExperiences.includes("The Obsidian Series")
                      }
                      variant={
                        purchasedExperiences.includes("The Obsidian Series")
                          ? "luxuryOutline"
                          : "heroFilled"
                      }
                      onClick={() =>
                        handleUnlockExperience("The Obsidian Series", 4500)
                      }
                    >
                      {purchasedExperiences.includes("The Obsidian Series")
                        ? "Purchased"
                        : "Unlock Experience"}
                    </Button>
                  </div>

                  {/* 🕯 ARCHIVE DROP */}

                  <div>
                    <h4 className="text-primary mb-3"> The Archive Drop</h4>

                    <p className="text-sm text-foreground/70 mb-3">
                      Unreleased or discontinued scent.
                    </p>

                    <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                      <li>• Too bold for retail</li>

                      <li>• Limited Batch</li>

                      <li>• Members only</li>
                    </ul>

                    <p className="text-primary mb-4">Redeem 6,000 Sparks</p>

                    <Button
                      className="px-8 py-4 whitespace-nowrap"
                      disabled={
                        rewardPoints < 6000 ||
                        purchasedExperiences.includes("The Archive Drop")
                      }
                      variant={
                        purchasedExperiences.includes("The Archive Drop")
                          ? "luxuryOutline"
                          : "heroFilled"
                      }
                      onClick={() =>
                        setConfirmExperience({
                          name: "The Archive Drop",
                          sparks: 6000,
                        })
                      }
                    >
                      {purchasedExperiences.includes("The Archive Drop")
                        ? "Purchased"
                        : rewardPoints >= 6000
                          ? "Unlock Experience"
                          : "Insufficient Sparks"}
                    </Button>
                  </div>

                  {/* 🕰 TIME CAPSULE */}

                  <div>
                    <h4 className="text-primary mb-3"> The Time Capsule</h4>

                    <p className="text-sm text-foreground/70 mb-3">
                      A Candle and letter to your future self.
                    </p>

                    <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                      <li>• Wax sealed envelope</li>

                      <li>• Hand written</li>

                      <li>• Delivered after 3 / 6 / 12 months</li>
                    </ul>

                    <p className="text-primary mb-4">Redeem 8,000 Sparks</p>

                    <Button
                      className="px-8 py-4 whitespace-nowrap"
                      disabled={
                        rewardPoints < 8000 ||
                        purchasedExperiences.includes("The Time Capsule")
                      }
                      variant={
                        purchasedExperiences.includes("The Time Capsule")
                          ? "luxuryOutline"
                          : "heroFilled"
                      }
                      onClick={() =>
                        setConfirmExperience({
                          name: "The Time Capsule",
                          sparks: 8000,
                        })
                      }
                    >
                      {purchasedExperiences.includes("The Time Capsule")
                        ? "Purchased"
                        : rewardPoints >= 8000
                          ? "Unlock Experience"
                          : "Insufficient Sparks"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ======================= TIER 2 LOCKED ======================= */}
              <div className="relative">
                <div
                  className={`luxury-card p-14 
${isTier2Unlocked ? "" : "blur-sm opacity-60"}
`}
                >
                  <h3 className="text-primary text-xl mb-4">
                    VELVET TIER ARCHIVE
                  </h3>

                  {isTier2Unlocked ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                      {/* MIDNIGHT DISPATCH */}

                      <div>
                        <h4 className="text-primary mb-3">
                          The Midnight Dispatch
                        </h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          A secret candle released on random nights.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Velvet members only</li>
                          <li>• Available for 3 hours</li>
                          <li>• Never released again</li>
                        </ul>

                        <p className="text-primary mb-4">Redeem 9,000 Sparks</p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            setConfirmExperience({
                              name: "Midnight Dispatch",
                              sparks: 9000,
                            })
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>

                      {/* COLLECTOR CARD */}

                      <div>
                        <h4 className="text-primary mb-3">
                          The Collector Card
                        </h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          A collectible philosophy card sent with each order.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Limited art cards</li>
                          <li>• 10 cards unlock a reward candle</li>
                          <li>• Gamified collecting</li>
                        </ul>

                        <p className="text-primary mb-4">Redeem 9,500 Sparks</p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            setConfirmExperience({
                              name: "Collector Card",
                              sparks: 9500,
                            })
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>

                      {/* MATCHBOX EDITIONS */}

                      <div>
                        <h4 className="text-primary mb-3">
                          The Matchbox Editions
                        </h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          Artistic matchboxes released in collectible designs.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Seasonal designs</li>
                          <li>• Members only</li>
                          <li>• Collect the full series</li>
                        </ul>

                        <p className="text-primary mb-4">
                          Redeem 10,000 Sparks
                        </p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            setConfirmExperience({
                              name: "Matchbox Editions",
                              sparks: 10000,
                            })
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/60">
                      Unlocks at 5,000 Sparks
                    </p>
                  )}
                </div>

                {!isTier2Unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border border-primary px-6 py-3 text-primary">
                      Unlock in Tier Two
                    </div>
                  </div>
                )}
              </div>

              {/* ======================= TIER 3 LOCKED ======================= */}

              <div className="relative">
                <div
                  className={`luxury-card p-14 
${isTier3Unlocked ? "" : "blur-sm opacity-60"}
`}
                >
                  <h3 className="text-primary text-xl mb-8">
                    OBSIDIAN TIER ARCHIVE
                  </h3>

                  {isTier3Unlocked ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                      {/* OBSIDIAN ATELIER */}

                      <div>
                        <h4 className="text-primary mb-3">The Scent Jury</h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          Members vote on the next fragrance release.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Influence future collections</li>
                          <li>• Vote on scent direction</li>
                          <li>• Receive the first batch</li>
                        </ul>

                        <p className="text-primary mb-4">
                          Redeem 12,000 Sparks
                        </p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            handleUnlockExperience(
                              "The Obsidian Atelier",
                              12000,
                            )
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>

                      {/* SECRET MENU */}

                      <div>
                        <h4 className="text-primary mb-3">The Secret Menu</h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          Hidden experimental products.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Prototype scents</li>
                          <li>• Archive labels</li>
                          <li>• Studio experiments</li>
                        </ul>

                        <p className="text-primary mb-4">
                          Redeem 13,000 Sparks
                        </p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            handleUnlockExperience("Secret Menu", 13000)
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>

                      {/* SCENT JURY */}

                      <div>
                        <h4 className="text-primary mb-3">
                          The Obsidian Atelier
                        </h4>

                        <p className="text-sm text-foreground/70 mb-3">
                          Design a candle with the studio.
                        </p>

                        <ul className="text-sm text-foreground/60 space-y-1 mb-4">
                          <li>• Choose scent direction</li>
                          <li>• Choose wax color</li>
                          <li>• Choose label quote</li>
                        </ul>

                        <p className="text-sm text-foreground/60 mb-3">
                          A small batch will be produced named after you.
                        </p>

                        <p className="text-primary mb-4">
                          Redeem 14,000 Sparks
                        </p>

                        <Button
                          variant="heroFilled"
                          onClick={() =>
                            handleUnlockExperience("Scent Jury", 14000)
                          }
                        >
                          Unlock Experience
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/60">
                      Unlocks at 10,000 Sparks
                    </p>
                  )}
                </div>

                {!isTier3Unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border border-primary px-6 py-3 text-primary">
                      Unlock in Tier Three
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* WAYS TO EARN */}

          {/* ================= WAYS TO EARN ================= */}

          <section className="text-center mb-28">
            <h2 className="text-3xl md:text-4xl tracking-[0.25em] font-light text-primary mb-4">
              WAYS TO EARN SPARKS
            </h2>

            <p className="text-foreground/60 font-light mb-14">
              Every action becomes an experience. Earn Sparks and unlock luxury
              rewards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {/* REVIEW */}

              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Link
                  to="/shop"
                  className="group luxury-card relative p-7 flex items-center gap-5
border border-primary/20 hover:border-primary/60
bg-gradient-to-br from-background via-background to-primary/5
transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
                    <Pencil className="text-primary" size={22} />
                  </div>

                  <div className="text-left">
                    <p className="text-primary tracking-wide font-light">
                      Write a Review
                    </p>

                    <p className="text-sm text-foreground/60">
                      Earn 500 Sparks
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* BIRTHDAY */}

              <motion.div whileHover={{ y: -8 }}>
                <button
                  onClick={() => setShowBirthdayModal(true)}
                  className="group luxury-card relative p-7 flex items-center gap-5 w-full text-left
border border-primary/20 hover:border-primary/60
bg-gradient-to-br from-background to-primary/5
transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                    <User className="text-primary" size={22} />
                  </div>

                  <div>
                    <p className="text-primary font-light">Birthday Reward</p>

                    <p className="text-sm text-foreground/60">
                      Earn 200 Sparks
                    </p>
                  </div>
                </button>
              </motion.div>

              {/* IMPORTANT DATE */}

              <motion.div whileHover={{ y: -8 }}>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="group luxury-card relative p-7 flex gap-5 items-center w-full text-left
border border-primary/20 hover:border-primary/60
bg-gradient-to-br from-background to-primary/5
transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                    <Zap className="text-primary" size={22} />
                  </div>

                  <div>
                    <p className="text-primary font-light">
                      Save Important Date
                    </p>

                    <p className="text-sm text-foreground/60">
                      Never forget special moments
                    </p>
                  </div>
                </button>
              </motion.div>

              {/* INSTAGRAM */}

              <motion.div whileHover={{ y: -8 }}>
                <button
                  onClick={handleInstagramFollow}
                  className="group luxury-card relative p-7 flex items-center gap-5 w-full text-left
 border border-primary/20 hover:border-primary/60
 bg-gradient-to-br from-background to-primary/5
 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                    <Instagram className="text-primary" size={22} />
                  </div>

                  <div>
                    <p className="text-primary font-light">
                      Follow on Instagram
                    </p>

                    <p className="text-sm text-foreground/60">
                      Earn 250 Sparks
                    </p>
                  </div>
                </button>
              </motion.div>

              {/* ORDER */}

              <motion.div whileHover={{ y: -8 }}>
                <Link
                  to="/shop"
                  className="group luxury-card relative p-7 flex gap-5 items-center
border border-primary/20 hover:border-primary/60
bg-gradient-to-br from-background to-primary/5
transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                    <ShoppingBag className="text-primary" size={22} />
                  </div>

                  <div>
                    <p className="text-primary font-light">Place an Order</p>

                    <p className="text-sm text-foreground/60">
                      1 Spark per ₹1 spent
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* SIGNUP */}

              <motion.div whileHover={{ y: -8 }}>
                <Link
                  to="/auth"
                  className="group luxury-card relative p-7 flex items-center gap-5
border border-primary/20 hover:border-primary/60
bg-gradient-to-br from-background to-primary/5
transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition" />

                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20">
                    <Gift className="text-primary" size={22} />
                  </div>

                  <div>
                    <p className="text-primary font-light">Signup Reward</p>

                    <p className="text-sm text-foreground/60">
                      Earn 100 Sparks
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* GAME SYSTEM */}
        </div>
      </main>

      {/* BIRTHDAY MODAL */}

      {/* ================= BIRTHDAY MODAL ================= */}

      {showBirthdayModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="luxury-card bg-background border border-primary/20 p-6 md:p-10 w-full max-w-md relative">
            {/* Close */}

            <button
              onClick={() => {
                setShowBirthdayModal(false);

                setBirthdayName("");

                setBirthdayDate(null);
              }}
              className="absolute top-5 right-5 text-primary hover:opacity-70"
            >
              <X size={20} />
            </button>

            <h3 className="text-primary text-xl tracking-widest font-light mb-8 text-center">
              Birthday Reward
            </h3>

            {/* FORM */}

            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Your Name"
                value={birthdayName}
                onChange={(e) => setBirthdayName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-primary/30 
focus:border-primary outline-none text-foreground placeholder:text-foreground/40"
              />

              <DatePicker
                selected={birthdayDate}
                onChange={(date) => setBirthdayDate(date)}
                dateFormat="dd MMMM yyyy"
                placeholderText="Select Birthday"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={80}
                scrollableYearDropdown
                className="w-full px-4 py-3 bg-black border border-primary/30 
focus:border-primary outline-none text-foreground"
              />

              <Button
                variant="heroFilled"
                className="w-full mt-2 tracking-[0.2em]"
                onClick={handleBirthdaySubmit}
              >
                SUBMIT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT */}

      {/* ================= EVENT MODAL ================= */}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="luxury-card bg-background border border-primary/20 p-6 md:p-10 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowEventModal(false);

                setEventName("");

                setEventDate(null);
              }}
              className="absolute top-5 right-5 text-primary hover:opacity-70"
            >
              <X size={20} />
            </button>

            <h3 className="text-primary text-xl tracking-widest font-light mb-8 text-center">
              Save Important Date
            </h3>

            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-primary/30 
focus:border-primary outline-none text-foreground placeholder:text-foreground/40"
              />

              <DatePicker
                selected={eventDate}
                onChange={(date) => setEventDate(date)}
                dateFormat="dd MMMM yyyy"
                placeholderText="Select Date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                yearDropdownItemNumber={80}
                scrollableYearDropdown
                className="w-full px-4 py-3 bg-black border border-primary/30 
focus:border-primary outline-none text-foreground"
              />

              <Button
                variant="heroFilled"
                className="w-full mt-2 tracking-[0.2em]"
                onClick={handleEventSubmit}
              >
                SAVE
              </Button>
            </div>
          </div>
        </div>
      )}
      {confirmExperience && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="luxury-card p-10 text-center max-w-md">
            <h3 className="text-primary text-xl mb-6">Confirm Unlock</h3>

            <p className="text-foreground/70 mb-8">
              Unlock <b>{confirmExperience.name}</b> for
              <b> {confirmExperience.sparks} Sparks</b>?
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                variant="luxuryOutline"
                onClick={() => setConfirmExperience(null)}
              >
                Cancel
              </Button>

              <Button
                variant="heroFilled"
                onClick={() => {
                  handleUnlockExperience(
                    confirmExperience.name,
                    confirmExperience.sparks,
                  );
                  setConfirmExperience(null);
                }}
              >
                Unlock
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Rewards;
