import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/contexts/Authcontext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://backend-jdug.onrender.com/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setOrders(data.recentOrders || []);
        setChartData(data.chart || []);
      });
  }, []);

  if (!stats) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-primary">Dashboard</h1>

          <div className="flex gap-4">
            <Button
              onClick={() => (window.location.href = "/admin/inventory")}
              variant="heroFilled"
            >
              Inventory Management
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}

        <div className="grid grid-cols-4 gap-6">
          <div className="luxury-card p-6">
            <p className="text-foreground/60">Revenue</p>
            <h2 className="text-2xl text-primary mt-2">
              ₹{stats.totalRevenue}
            </h2>
          </div>

          <div className="luxury-card p-6">
            <p className="text-foreground/60">Orders</p>
            <h2 className="text-2xl text-primary mt-2">{stats.totalOrders}</h2>
          </div>

          <div className="luxury-card p-6">
            <p className="text-foreground/60">Customers</p>
            <h2 className="text-2xl text-primary mt-2">
              {stats.totalCustomers}
            </h2>
          </div>

          <div className="luxury-card p-6">
            <p className="text-foreground/60">Average Order</p>
            <h2 className="text-2xl text-primary mt-2">
              ₹{Math.round(stats.totalRevenue / stats.totalOrders || 0)}
            </h2>
          </div>
        </div>

        {/* ================= SALES CHART ================= */}

        <div className="luxury-card p-6">
          <h2 className="text-xl text-primary mb-6">Revenue (Last 7 Days)</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c9a14a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div className="luxury-card p-6">
          <h2 className="text-xl text-primary mb-6">Recent Orders</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-primary border-b border-primary/20">
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-primary/10">
                  <td className="py-3">{order._id.slice(-6)}</td>
                  <td>{order.customer?.fullName}</td>
                  <td>₹{order.amount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= LOW STOCK SECTION ================= */}

        <div className="luxury-card p-6">
          <h2 className="text-xl text-primary mb-4">Inventory Alerts</h2>

          <p className="text-foreground/60">
            Low stock alerts will appear here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
