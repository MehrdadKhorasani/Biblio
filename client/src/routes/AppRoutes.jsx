import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/auth/Unauthorized";

import Home from "../pages/home/Home";
import BookDetail from "../pages/BookDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrder from "../pages/dashboard/MyOrders";
import Dashboard from "../pages/dashboard/Dashboard";
import OrderSuccess from "../pages/OrderSuccess";
import OrderDetails from "../pages/orders/OrderDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/cart" element={<Cart />} />

      {/* Private */}
      <Route element={<PrivateRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrder />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={[2]} />}>
        <Route path="/admin" element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
