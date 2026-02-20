import { useEffect, useState, useCallback } from "react";
import { fetchOrderStatusReport } from "../../../api/report.api";

import { toPersianNumber } from "../../../utils/toPersianNumbers";
import { orderStatusToPersian } from "../../../utils/orderStatusToPersian";

const statusOptions = [
  { label: "همه", value: "" },
  { label: "در انتظار", value: "pending" },
  { label: "پرداخت شده", value: "paid" },
  { label: "ارسال شده", value: "shipped" },
  { label: "تحویل شده", value: "delivered" },
  { label: "لغو شده", value: "cancelled" },
];

const OrderStatusReport = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchOrderStatusReport({
        userName: search,
        status,
        page,
        limit: 10,
      });

      setReports(data || []);
      setTotalPages(1);
    } catch (error) {
      console.error("Error loading reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const formatDate = (date) => new Date(date).toLocaleString("fa-IR");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">گزارش وضعیت سفارش‌ها</h1>

      {/* 🔍 فیلترها */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="جستجوی نام کاربر..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 جدول */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">در حال بارگذاری...</div>
        ) : (
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3">شناسه سفارش</th>
                <th className="px-4 py-3">نام کاربر</th>
                <th className="px-4 py-3">وضعیت قبلی</th>
                <th className="px-4 py-3">وضعیت فعلی</th>
                <th className="px-4 py-3">تغییر دهنده</th>
                <th className="px-4 py-3">تاریخ تغییر</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    موردی یافت نشد
                  </td>
                </tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {toPersianNumber(item.orderId)}
                    </td>
                    <td className="px-4 py-3">{item.customerName}</td>
                    <td className="px-4 py-3">
                      {orderStatusToPersian(item.oldStatus)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {orderStatusToPersian(item.newStatus)}
                    </td>
                    <td className="px-4 py-3">{item.changedBy || "سیستم"}</td>
                    <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔢 Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          قبلی
        </button>

        <span className="px-4 py-2">
          صفحه {toPersianNumber(page)} از {toPersianNumber(totalPages)}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default OrderStatusReport;
