import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toPersianNumber } from "../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../utils/orderStatusToPersian";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchOrders = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          status: filters.status || undefined,
          userName: filters.search || undefined,
          sortOrder: filters.sortOrder || "desc",
          page: filters.page || page,
          limit: 10,
        };

        const res = await api.get("/orders/admin", { params });
        if (res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
          setTotalPages(res.data.totalPages || 1);
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
    },
    [page],
  );

  // وقتی صفحه عوض می‌شود، سفارش‌ها لود شوند
  useEffect(() => {
    fetchOrders({ status: statusFilter, search: searchUser, sortOrder, page });
  }, [fetchOrders, page]);

  const applyFilters = () => {
    setPage(1); // وقتی فیلتر اعمال می‌شود، به صفحه اول برگرد
    fetchOrders({
      status: statusFilter,
      search: searchUser,
      sortOrder,
      page: 1,
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders({
        status: statusFilter,
        search: searchUser,
        sortOrder,
        page,
      });
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
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(order.id, "shipped");
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            ارسال سفارش
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(order.id, "delivered");
            }}
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
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="جستجو براساس نام کاربر"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border px-3 py-1 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="paid">پرداخت شده</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="desc">جدیدترین</option>
          <option value="asc">قدیمی‌ترین</option>
        </select>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          اعمال فیلتر
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">لیست سفارش‌ها</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">سفارشی یافت نشد.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">شناسه سفارش</th>
                <th className="py-2 px-4 border-b">نام کاربر</th>
                <th className="py-2 px-4 border-b">وضعیت</th>
                <th className="py-2 px-4 border-b">مبلغ کل</th>
                <th className="py-2 px-4 border-b">آیتم‌ها</th>
                <th className="py-2 px-4 border-b">عملیات</th>
                <th className="py-2 px-4 border-b">تاریخچه</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() =>
                    navigate(`/dashboard/admin/orders/${order.id}`)
                  }
                >
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

      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
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
        onClick={(e) => {
          e.stopPropagation();
          loadHistory();
        }}
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
