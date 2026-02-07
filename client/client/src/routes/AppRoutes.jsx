import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import BookList from "../pages/books/BookList";
import Cart from "../pages/cart/Cart";
import MyOrder from "../pages/order/MyOrder";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<MyOrder />} />
    </Routes>
  );
};

export default AppRoutes;
