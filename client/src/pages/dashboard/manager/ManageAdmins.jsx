import React, { useEffect, useState, useCallback } from "react";
import { fetchManagerAdmins, toggleUserStatus } from "../../../api/user.api";
import { toPersianNumber } from "../../../utils/toPersianNumbers";
import { Link } from "react-router-dom";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchManagerAdmins({
        search: search.trim() || undefined,
      });
      setAdmins(data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      alert("مشکلی در دریافت ادمین‌ها پیش آمد");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleToggle = async (e, userId) => {
    e.stopPropagation();
    try {
      await toggleUserStatus(userId);
      loadAdmins();
    } catch (err) {
      console.error("Error toggling admin status:", err);
      alert("مشکلی در تغییر وضعیت ادمین پیش آمد");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">مدیریت ادمین‌ها</h1>

      <Link to="/dashboard/manager/admins/new">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
          افزودن ادمین
        </button>
      </Link>
      {/* جستجو */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام و نام خانوادگی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-4 py-2 border rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 transition"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="py-3 px-4">شناسه</th>
                <th className="py-3 px-4">نام</th>
                <th className="py-3 px-4">ایمیل</th>
                <th className="py-3 px-4">نقش</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{toPersianNumber(admin.id)}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {admin.firstName} {admin.lastName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{admin.email}</td>
                  <td className="py-3 px-4">
                    {admin.roleId === 2
                      ? "ادمین"
                      : admin.roleId === 3
                        ? "مدیر"
                        : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        admin.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {admin.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => handleToggle(e, admin.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                        admin.isActive
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {admin.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    ادمینی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
