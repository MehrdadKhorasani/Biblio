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
import UserPanel from "../pages/dashboard/UserPanel";
import Profile from "../pages/dashboard/Profile";
import RoleRedirect from "../pages/dashboard/RoleRedirect";
import AdminOrders from "../pages/dashboard/AdminOrders";

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
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Redirect بر اساس نقش */}
          <Route index element={<RoleRedirect />} />

          {/* USER */}
          <Route element={<PrivateRoute allowedRoles={[1]} />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ADMIN */}
          <Route element={<PrivateRoute allowedRoles={[2]} />}>
            <Route path="admin" element={<div>پنل ادمین</div>} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/books" element={<div>مدیریت کتاب‌ها</div>} />
          </Route>

          {/* MANAGER */}
          <Route element={<PrivateRoute allowedRoles={[3]} />}>
            <Route path="manager" element={<div>پنل مدیر</div>} />
            <Route path="manager/users" element={<div>مدیریت کاربران</div>} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
