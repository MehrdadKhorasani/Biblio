import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toPersianNumber } from "../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../utils/orderStatusToPersian";
import OrderStatusBar from "../../components/orders/OrderStatusBar";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePay = async () => {
    if (!order || order.status !== "pending") return;

    try {
      setPaying(true);
      await axios.post(`/orders/${order.id}/pay`);
      const res = await axios.get(`/orders/${order.id}`);
      setOrder(res.data.order); // آپدیت وضعیت سفارش
      alert("پرداخت با موفقیت انجام شد!");
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "خطا در پرداخت، دوباره تلاش کنید");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-10">در حال بارگذاری...</div>;
  if (!order) return <div className="p-10">سفارش پیدا نشد</div>;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/dashboard/orders")}
        className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        ← بازگشت
      </button>

      <OrderStatusBar currentStatus={order.status} />

      <h1 className="text-3xl font-bold mb-8">
        جزئیات سفارش #{toPersianNumber(order.id)}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-8 space-y-3">
        <p>
          وضعیت:
          <span className="mr-2 font-bold text-indigo-600">
            {orderStatusToPersian(order.status)}
          </span>
        </p>

        <p>نام شهر: {order.city}</p>
        <p>آدرس: {order.address}</p>
        <p>تلفن: {order.phone}</p>
        <p>کد پستی: {order.postalCode}</p>
        <p>
          جمع کل:
          <span className="mr-2 font-bold">
            {toPersianNumber(order.totalPrice ?? 0)} تومان
          </span>
        </p>
        {order.status === "pending" && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            {paying ? "در حال پرداخته..." : "پرداخت سفارش"}
          </button>
        )}

        {order.note && (
          <div className="bg-yellow-50 p-4 rounded mb-6">
            <p className="font-semibold">یادداشت سفارش:</p>
            <p>{order.note}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">محصولات سفارش</h2>

          <div className="space-y-6">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.bookId}
                  className="flex justify-between border-b pb-4 items-center"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        تعداد: {toPersianNumber(item.quantity ?? 0)}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-indigo-600">
                    {toPersianNumber(item.unitPrice * item.quantity)} تومان
                  </p>
                </div>
              ))
            ) : (
              <p>هیچ محصولی یافت نشد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
