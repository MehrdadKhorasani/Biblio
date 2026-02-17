import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/auth/Unauthorized";

import Home from "../pages/home/Home";
import BookDetail from "../pages/BookDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

import OrderDetails from "../pages/orders/OrderDetails";
import MyOrders from "../pages/dashboard/MyOrders";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Profile from "../pages/dashboard/Profile";
import AdminOrders from "../pages/dashboard/AdminOrders";
import AdminOrderDetails from "../pages/dashboard/AdminOrderDetails";
import AdminBooks from "../pages/dashboard/AdminBooks";
import EditBook from "../pages/dashboard/EditBook";

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

      {/* Private base */}
      <Route element={<PrivateRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Dashboard Layout wrapper */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* USER */}
          <Route element={<PrivateRoute allowedRoles={[1]} />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ADMIN */}
          <Route element={<PrivateRoute allowedRoles={[2]} />}>
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="admin/books" element={<AdminBooks />} />
            <Route path="admin/books/edit/:id" element={<EditBook />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
