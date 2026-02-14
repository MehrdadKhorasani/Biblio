import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-10">در حال بارگذاری...</div>;

  if (!order) return <div className="p-10">سفارش پیدا نشد</div>;

  return (
    <div dir="rtl">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          جزئیات سفارش #{toPersianNumber(order.id)}
        </h1>

        {/* اطلاعات سفارش */}
        <div className="bg-white p-6 rounded shadow mb-8 space-y-3">
          <p>
            وضعیت:
            <span className="mr-2 font-bold text-indigo-600">
              {order.status}
            </span>
          </p>

          <p>نام شهر: {order.city}</p>
          <p>آدرس: {order.address}</p>
          <p>تلفن: {order.phone}</p>
          <p>کد پستی: {order.postalCode}</p>
          <p>
            جمع کل:
            <span className="mr-2 font-bold">
              {toPersianNumber(order.totalPrice)} تومان
            </span>
          </p>
        </div>

        {/* آیتم‌های سفارش */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">محصولات سفارش</h2>

          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    تعداد: {toPersianNumber(item.quantity)}
                  </p>
                </div>

                <p className="font-bold text-indigo-600">
                  {toPersianNumber(item.unitPrice * item.quantity)} تومان
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails;
