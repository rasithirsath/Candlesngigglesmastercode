import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { motion } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://backend-jdug.onrender.com/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <AdminLayout>
      <div className="p-12">
        {/* Header */}

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl text-primary tracking-wide">
            Orders Management
          </h1>

          <p className="text-foreground/60">Total Orders: {orders.length}</p>
        </div>

        {/* Orders Table */}

        <div className="luxury-card p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/20 text-primary text-sm uppercase tracking-wider">
                <th className="py-4">Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-primary/10 cursor-pointer hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(201,161,74,0.15)] transition-all duration-300"
                  onClick={() => {
                    if (order.user?._id) {
                      navigate(`/admin/customer/${order.user._id}`);
                    }
                  }}
                >
                  {/* Order ID */}

                  <td className="py-4 font-mono text-primary">
                    #{order._id.slice(-6)}
                  </td>

                  {/* Customer */}

                  <td>
                    {order.user?.name ||
                      order.customer?.fullName ||
                      "Guest User"}
                  </td>
                  <td>{order.user?.email || order.customer?.email || "-"}</td>

                  {/* Amount */}

                  <td className="font-semibold text-primary">
                    ₹{order.amount}
                  </td>

                  {/* Status */}

                  <td>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-900/40 text-green-400 border border-green-700">
                      {order.status || "paid"}
                    </span>
                  </td>

                  {/* Date */}

                  <td className="text-foreground/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
