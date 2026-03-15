import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-black border-r border-primary/20 p-6">
        <h2 className="text-primary text-xl mb-8">Admin Panel</h2>

        <div className="flex flex-col gap-4">
          <Link to="/admin/dashboard">Dashboard</Link>

          <Link to="/admin/orders">Orders</Link>

          <Link to="/admin/products">Products</Link>

          {/* <Link to="/admin/customers">Customers</Link> */}
          {/* 
          <Link to="/admin/reviews">Reviews</Link> */}
        </div>
      </div>

      <div className="flex-1 p-10">{children}</div>
    </div>
  );
};

export default AdminLayout;
