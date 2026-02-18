import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  const today = new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full px-6 py-10 space-y-8">
      {/* Welcome Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">خوش آمدید 👋</h1>

        <p className="text-lg text-gray-600 mb-2">
          {user?.firstName} {user?.lastName}
        </p>

        <p className="text-sm text-gray-500">{today}</p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            رفتن به صفحه اصلی فروشگاه
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-gray-500 mb-2">تعداد کتاب‌ها</h3>
            <p className="text-3xl font-bold text-blue-600">
              {toPersianNumber(stats.books)}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-gray-500 mb-2">تعداد سفارش‌ها</h3>
            <p className="text-3xl font-bold text-green-600">
              {toPersianNumber(stats.orders)}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-gray-500 mb-2">تعداد کاربران</h3>
            <p className="text-3xl font-bold text-purple-600">
              {toPersianNumber(stats.users)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
