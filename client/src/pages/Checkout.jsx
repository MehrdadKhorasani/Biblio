import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/order.api";
import { toPersianNumber } from "../utils/toPersianNumbers";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createOrder({
        items: cartItems.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
        })),
        phone,
        address,
        city,
        postalCode,
        note,
      });

      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">تکمیل سفارش</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <input
            type="text"
            placeholder="شماره تماس"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <input
            type="text"
            placeholder="شهر"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <input
            type="text"
            placeholder="کد پستی"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <textarea
            placeholder="آدرس کامل"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <textarea
            placeholder="یادداشت (اختیاری)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded p-2"
          />

          <div className="flex justify-between font-bold text-lg">
            <span>جمع کل:</span>
            <span>{toPersianNumber(totalPrice)} تومان</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            {loading ? "در حال ثبت..." : "ثبت سفارش"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
