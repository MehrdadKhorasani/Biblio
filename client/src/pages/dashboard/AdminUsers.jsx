import React, { useEffect, useState, useCallback } from "react";
import { fetchAdminUsers, toggleUserStatus } from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers({
        search: search.trim() || undefined,
      });
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("مشکلی در دریافت کاربران پیش آمد");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggle = async (e, userId) => {
    e.stopPropagation(); // جلوگیری از کلیک شدن ردیف
    try {
      await toggleUserStatus(userId);
      loadUsers();
    } catch (err) {
      console.error("Error toggling user:", err);
      alert("مشکلی در تغییر وضعیت کاربر پیش آمد");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">مدیریت کاربران</h1>

      {/* Search */}
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

      {/* Loading */}
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
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() =>
                    navigate(`/dashboard/admin/users/${user.id}/orders`)
                  }
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4">{toPersianNumber(user.id)}</td>

                  <td className="py-3 px-4 font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="py-3 px-4 text-gray-600">{user.email}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => handleToggle(e, user.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                        user.isActive
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {user.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    کاربری یافت نشد
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

export default AdminUsers;
