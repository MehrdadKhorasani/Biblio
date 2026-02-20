import React, { useEffect, useState } from "react";
import { fetchSalesSummary, fetchDailySales } from "../../../api/report.api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toPersianNumber } from "../../../utils/toPersianNumbers";

export default function SalesReport() {
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);

  useEffect(() => {
    const loadSummary = async () => {
      const data = await fetchSalesSummary();
      setSummary(data);
    };
    const loadDaily = async () => {
      const data = await fetchDailySales();
      setDailySales(data);
    };

    loadSummary();
    loadDaily();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">گزارش فروش</h1>

      {/* کارت‌های خلاصه */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border p-4 rounded shadow text-center">
            <div>💰 مجموع فروش</div>
            <div className="text-lg font-bold">
              {toPersianNumber(summary.totalRevenue.toLocaleString())} تومان
            </div>
          </div>
          <div className="border p-4 rounded shadow text-center">
            <div>🛒 تعداد سفارش‌ها</div>
            <div className="text-lg font-bold">
              {toPersianNumber(summary.totalOrders)}
            </div>
          </div>
          <div className="border p-4 rounded shadow text-center">
            <div>📦 محصولات فروخته شده</div>
            <div className="text-lg font-bold">
              {toPersianNumber(summary.totalProductsSold)}
            </div>
          </div>
          <div className="border p-4 rounded shadow text-center">
            <div>📊 میانگین ارزش سفارش</div>
            <div className="text-lg font-bold">
              {toPersianNumber(summary.averageOrderValue.toLocaleString())}{" "}
              تومان
            </div>
          </div>
        </div>
      )}

      {/* نمودار فروش روزانه */}
      <div className="border p-4 rounded shadow">
        <h2 className="mb-2 font-bold">فروش روزانه</h2>
        <DailySalesChart data={dailySales} />
      </div>
    </div>
  );
}

export function DailySalesChart({ data }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis
          tickFormatter={(value) => toPersianNumber(value.toLocaleString())}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(label)}
          formatter={(value) =>
            `${toPersianNumber(value.toLocaleString())} تومان`
          }
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
