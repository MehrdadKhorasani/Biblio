import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders/my");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await axios.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  return (
    <div dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">سفارش‌های من</h1>

        {loading ? (
          <p>در حال دریافت اطلاعات...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded shadow space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      سفارش شماره {toPersianNumber(order.id)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="font-bold text-indigo-600">
                    {toPersianNumber(order.totalPrice)} تومان
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      مشاهده جزئیات
                    </button>

                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        لغو سفارش
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
