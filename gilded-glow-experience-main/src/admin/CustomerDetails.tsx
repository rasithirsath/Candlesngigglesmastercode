import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const CustomerDetails = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://backend-wghd.onrender.com/api/admin/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  }, [id]);

  if (!customer) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-10 space-y-10">
        <h1 className="text-3xl text-primary">Customer Details</h1>

        {/* CUSTOMER INFO */}

        <div className="luxury-card p-6">
          <h2 className="text-xl text-primary mb-4">Profile</h2>

          <p>Name: {customer.user.name}</p>
          <p>Email: {customer.user.email}</p>
          <p>Sparks: {customer.user.rewardPoints}</p>
          <p>Tier: {customer.user.tier || "Starter"}</p>
        </div>

        {/* ORDERS */}

        <div className="luxury-card p-6">
          <h2 className="text-xl text-primary mb-4">Orders</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="py-3">Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {customer.orders.map((order: any) => (
                <tr key={order._id} className="border-b border-primary/10">
                  <td className="py-3">{order._id.slice(-6)}</td>
                  <td>₹{order.amount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetails;
