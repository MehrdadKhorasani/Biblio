import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toPersianNumber } from "../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../utils/orderStatusToPersian";
import api from "../../api/axios";

const UserOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/user/${id}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      alert("مشکلی در دریافت سفارشات کاربر پیش آمد");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          سفارشات کاربر #{toPersianNumber(id)}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          بازگشت
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          در حال بارگذاری...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
          این کاربر تاکنون سفارشی ثبت نکرده است
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-4">شناسه سفارش</th>
                <th className="p-4">تاریخ</th>
                <th className="p-4">مبلغ کل</th>
                <th className="p-4">وضعیت</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {toPersianNumber(order.id)}
                  </td>

                  <td className="p-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </td>

                  <td className="p-4 text-gray-700 font-semibold">
                    {toPersianNumber(order.totalPrice?.toLocaleString())} تومان
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled" ||
                                  order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {orderStatusToPersian(order.status)}
                    </span>
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

export default UserOrders;
