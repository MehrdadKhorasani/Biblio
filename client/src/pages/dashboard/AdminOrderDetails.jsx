import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toPersianNumber } from "../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../utils/orderStatusToPersian";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);

        const historyRes = await api.get(`/orders/${id}/history`);
        setHistory(historyRes.data.history || []);
      } catch (err) {
        console.error("خطا در دریافت جزئیات سفارش:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        در حال بارگذاری اطلاعات سفارش...
      </div>
    );

  if (!order)
    return (
      <div className="text-center mt-10 text-red-500">سفارش یافت نشد.</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* دکمه بازگشت */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        بازگشت
      </button>

      {/* اطلاعات کلی سفارش */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold border-b pb-2">اطلاعات سفارش</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p>شناسه سفارش: {toPersianNumber(order.id)}</p>
          <p>وضعیت: {orderStatusToPersian(order.status)}</p>
          <p>
            مبلغ کل: {toPersianNumber(order.totalPrice.toLocaleString())} تومان
          </p>
          <p>تاریخ ثبت: {new Date(order.createdAt).toLocaleString("fa-IR")}</p>
        </div>

        {order.note && (
          <div className="mt-4">
            <p className="font-medium">یادداشت:</p>
            <p className="text-gray-600">{order.note}</p>
          </div>
        )}
      </div>

      {/* اطلاعات کاربر */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-bold border-b pb-2">اطلاعات کاربر</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p>
            نام: {order.user?.firstName} {order.user?.lastName}
          </p>
          <p>ایمیل: {order.user?.email || "-"}</p>
          <p>تلفن: {order.phone}</p>
          <p>شهر: {order.city}</p>
          <p>کد پستی: {toPersianNumber(order.postalCode)}</p>
        </div>

        <div className="mt-4">
          <p className="font-medium">آدرس:</p>
          <p className="text-gray-600">{order.address}</p>
        </div>
      </div>

      {/* آیتم‌های سفارش */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">آیتم‌های سفارش</h2>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-right">نام کتاب</th>
              <th className="py-2 px-4 text-center">تعداد</th>
              <th className="py-2 px-4 text-center">قیمت واحد</th>
              <th className="py-2 px-4 text-center">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.book?.title || "نامشخص"}</td>
                <td className="py-2 px-4 text-center">
                  {toPersianNumber(item.quantity)}
                </td>
                <td className="py-2 px-4 text-center">
                  {toPersianNumber(item.unitPrice.toLocaleString())} تومان
                </td>
                <td className="py-2 px-4 text-center">
                  {toPersianNumber(
                    (item.unitPrice * item.quantity).toLocaleString(),
                  )}{" "}
                  تومان
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* تاریخچه */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">
          تاریخچه تغییر وضعیت
        </h2>

        {history.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {history.map((h) => (
              <li key={h.id} className="bg-gray-50 p-2 rounded-lg">
                {orderStatusToPersian(h.oldStatus)} ←{" "}
                {orderStatusToPersian(h.newStatus)} توسط {h.firstName}{" "}
                {h.lastName} در {new Date(h.createdAt).toLocaleString("fa-IR")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">تاریخچه‌ای ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
