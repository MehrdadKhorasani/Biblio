import { useEffect, useState, useCallback } from "react";
import { fetchBookStockReport } from "../../../api/report.api";
import { toPersianNumber } from "../../../utils/toPersianNumbers";
import { bookStockToPersian } from "../../../utils/bookStockToPersian";

const BookStockReport = () => {
  const [reports, setReports] = useState([]);
  const [bookId, setBookId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ⚡ Fetch reports from backend
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBookStockReport({
        bookId,
        page,
        limit: 10,
      });

      setReports(data || []);
      // فعلاً چون سرور تعداد کل صفحات رو نمی‌فرسته، totalPages رو ثابت می‌گیریم
      setTotalPages(1);
    } catch (error) {
      console.error("Error loading stock report:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [bookId, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const formatDate = (date) => new Date(date).toLocaleString("fa-IR");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">گزارش موجودی کتاب‌ها</h1>

      {/* 🔍 فیلتر */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="جستجوی شناسه کتاب..."
          value={bookId}
          onChange={(e) => {
            setPage(1);
            setBookId(e.target.value);
          }}
          className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 📋 جدول */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">در حال بارگذاری...</div>
        ) : (
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3">شناسه لاگ</th>
                <th className="px-4 py-3">شناسه کتاب</th>
                <th className="px-4 py-3">نام کتاب</th>
                <th className="px-4 py-3">عملیات</th>
                <th className="px-4 py-3">موجودی قبلی</th>
                <th className="px-4 py-3">موجودی جدید</th>
                <th className="px-4 py-3">یادداشت</th>
                <th className="px-4 py-3">تغییر دهنده</th>
                <th className="px-4 py-3">تاریخ</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6">
                    موردی یافت نشد
                  </td>
                </tr>
              ) : (
                reports.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{toPersianNumber(item.id)}</td>
                    <td className="px-4 py-3">
                      {toPersianNumber(item.bookId)}
                    </td>
                    <td className="px-4 py-3">{item.bookTitle}</td>
                    <td className="px-4 py-3 font-semibold">
                      {bookStockToPersian(item.action)}
                    </td>
                    <td className="px-4 py-3">
                      {toPersianNumber(item.oldStock)}
                    </td>
                    <td className="px-4 py-3">
                      {toPersianNumber(item.newStock)}
                    </td>
                    <td className="px-4 py-3">{item.note || "-"}</td>
                    <td className="px-4 py-3">{item.actorName}</td>
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
          صفحه {page} از {totalPages}
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

export default BookStockReport;
