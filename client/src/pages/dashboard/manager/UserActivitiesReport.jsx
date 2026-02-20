import React, { useState, useEffect, useCallback } from "react";
import { fetchUserActivityReport } from "../../../api/report.api";
import { userActivitiesToPersian } from "../../../utils/userActivitiesToPersian";

const formatToJalali = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function UserActivityReport() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [actorFilter, setActorFilter] = useState("");
  const [targetFilter, setTargetFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };

      if (actorFilter) params.actorId = actorFilter;
      if (targetFilter) params.targetUserId = targetFilter;

      const data = await fetchUserActivityReport(params);
      setLogs(data);
    } catch (err) {
      console.error("Error loading user activity report:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, actorFilter, targetFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">گزارش فعالیت کاربران</h1>

      {/* فیلترها */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="فیلتر بازیگر (Actor ID)"
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="text"
          placeholder="فیلتر کاربر هدف (Target ID)"
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
          className="border p-1 rounded"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchLogs();
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          اعمال فیلتر
        </button>
      </div>

      {/* جدول */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">زمان</th>
            <th className="border p-2">بازیگر</th>
            <th className="border p-2">کاربر هدف</th>
            <th className="border p-2">عمل</th>
            <th className="border p-2">جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center p-2">
                در حال بارگذاری...
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-2">
                گزارشی موجود نیست
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2">{formatToJalali(log.createdAt)}</td>
                <td className="border p-2">{log.actorName || "-"}</td>
                <td className="border p-2">{log.targetUserName || "-"}</td>
                <td className="border p-2">
                  {userActivitiesToPersian(log.action)}
                </td>
                <td className="border p-2">
                  {log.details ? JSON.stringify(log.details) : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination ساده */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded"
        >
          قبلی
        </button>
        <span>صفحه {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
