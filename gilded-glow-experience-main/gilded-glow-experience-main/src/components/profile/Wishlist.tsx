import { useStore } from "@/contexts/StoreContext";

const Wishlist = () => {
  const { wishlist } = useStore();

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">Wishlist</h2>

      {wishlist.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
