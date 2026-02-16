import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { toPersianNumber } from "../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../utils/orderStatusToPersian";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/admin");
      if (res.data && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
        console.error("داده‌های سفارش نامعتبر هستند:", res.data);
      }
    } catch (err) {
      console.error("خطا در دریافت سفارش‌ها:", err);
      setError("دریافت سفارش‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      console.error("خطا در لغو سفارش:", err);
      alert("لغو سفارش ناموفق بود.");
    }
  };

  const handlePay = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/pay`);
      fetchOrders();
    } catch (err) {
      console.error("خطا در پرداخت سفارش:", err);
      alert("علامت‌گذاری پرداخت ناموفق بود.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("خطا در بروزرسانی وضعیت:", err);
      alert(`بروزرسانی وضعیت به "${newStatus}" ناموفق بود.`);
    }
  };

  const fetchStatusHistory = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/history`);
      return res.data.history || [];
    } catch (err) {
      console.error("خطا در دریافت تاریخچه وضعیت:", err);
      return [];
    }
  };
  const renderAdminAction = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <span className="text-amber-500 font-medium text-sm">
            در انتظار اقدام کاربر
          </span>
        );

      case "paid":
        return (
          <button
            onClick={() => handleStatusChange(order.id, "shipped")}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            ارسال سفارش
          </button>
        );

      case "shipped":
        return (
          <button
            onClick={() => handleStatusChange(order.id, "delivered")}
            className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
          >
            تحویل شد
          </button>
        );

      case "cancelled":
      case "delivered":
      default:
        return <span className="text-gray-400 text-sm">عملیاتی ندارد</span>;
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        در حال بارگذاری سفارش‌ها...
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">لیست سفارش‌ها</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">سفارشی یافت نشد.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">شناسه سفارش</th>
                <th className="py-2 px-4 border-b">شناسه کاربر</th>
                <th className="py-2 px-4 border-b">وضعیت</th>
                <th className="py-2 px-4 border-b">مبلغ کل</th>
                <th className="py-2 px-4 border-b">آیتم‌ها</th>
                <th className="py-2 px-4 border-b">عملیات</th>
                <th className="py-2 px-4 border-b">تاریخچه</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    {toPersianNumber(order.id)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : "نامشخص"}
                  </td>
                  <td className="py-2 px-4 border-b text-center capitalize">
                    {orderStatusToPersian(order.status)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {toPersianNumber(order.totalPrice.toLocaleString())} تومان
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.items?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            کتاب {item.book?.title || "نامشخص"} ×{" "}
                            {toPersianNumber(item.quantity)} (
                            {toPersianNumber(item.unitPrice.toLocaleString())}{" "}
                            تومان)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">هیچ آیتمی ندارد</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {renderAdminAction(order)}
                  </td>

                  <td className="py-2 px-4 border-b">
                    <StatusHistory
                      orderId={order.id}
                      fetchHistory={fetchStatusHistory}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatusHistory = ({ orderId, fetchHistory }) => {
  const [history, setHistory] = useState([]);
  const [show, setShow] = useState(false);

  const loadHistory = async () => {
    if (!show) {
      const data = await fetchHistory(orderId);
      setHistory(data);
    }
    setShow(!show);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={loadHistory}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded mb-1"
      >
        {show ? "پنهان کردن تاریخچه" : "نمایش تاریخچه"}
      </button>
      {show && (
        <ul className="list-disc list-inside text-xs text-gray-700 max-h-40 overflow-y-auto">
          {history.length > 0 ? (
            history.map((h) => (
              <li key={h.id}>
                {orderStatusToPersian(h.oldStatus)} ←{" "}
                {orderStatusToPersian(h.newStatus)} توسط{" "}
                {h.changedBy || "سیستم"} در{" "}
                {new Date(h.createdAt).toLocaleString("fa-IR")}
              </li>
            ))
          ) : (
            <li className="text-gray-400">تاریخچه‌ای موجود نیست</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
