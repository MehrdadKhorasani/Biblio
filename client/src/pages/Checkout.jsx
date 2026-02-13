import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { toPersianNumber } from "../utils/toPersianNumbers";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    // اینجا بعداً به بک‌اند وصل میشه
    console.log("Order Data:", {
      items: cartItems,
      ...formData,
      totalPrice,
    });

    clearCart();
    navigate("/order-success");
  };

  if (cartItems.length === 0) {
    return (
      <div dir="rtl">
        <Header />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        {/* فرم اطلاعات ارسال */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">اطلاعات ارسال</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="phone"
              placeholder="شماره تماس"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="text"
              name="city"
              placeholder="شهر"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="text"
              name="postalCode"
              placeholder="کد پستی"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              name="address"
              placeholder="آدرس کامل"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              ثبت نهایی سفارش
            </button>
          </form>
        </div>

        {/* خلاصه سفارش */}
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">خلاصه سفارش</h2>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.title} × {toPersianNumber(item.quantity)}
                </span>
                <span>{toPersianNumber(item.price * item.quantity)} تومان</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between font-bold">
            <span>جمع کل:</span>
            <span>{toPersianNumber(totalPrice)} تومان</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
