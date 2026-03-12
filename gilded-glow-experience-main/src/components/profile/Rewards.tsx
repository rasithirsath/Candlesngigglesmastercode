import { useAuth } from "@/contexts/Authcontext";

const Rewards = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">Giggle Points</h2>

      <div className="luxury-card p-8 text-center">
        <h3 className="text-4xl text-primary">{user.rewardPoints}</h3>

        <p>Your Sparks</p>
      </div>
    </div>
  );
};

export default Rewards;
