import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backend-wghd.onrender.com/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-primary mb-6">My Orders</h2>

      {Array.isArray(orders) &&
        orders.map((o) => (
          <div key={o._id} className="border p-4 mb-4">
            <p>Order ID: {o._id}</p>
            <p>Amount: ₹{o.amount}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
    </div>
  );
};

export default Orders;
