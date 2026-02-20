import React, { useEffect, useState, useCallback } from "react";
import {
  fetchManagerUsers,
  adminChangeUserPassword,
} from "../../../api/user.api";

const AdminChangeUserPassword = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // کاربری که میخوایم رمزشو تغییر بدیم
  const [newPassword, setNewPassword] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const userList = await fetchManagerUsers({ search });
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openChangePassword = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setPopupOpen(true);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      alert("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    try {
      await adminChangeUserPassword(selectedUser.id, newPassword);
      alert("رمز با موفقیت تغییر یافت");
      setPopupOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error changing password:", error);
      alert("خطا در تغییر رمز، دوباره تلاش کنید");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">تغییر رمز کاربران</h1>

      <input
        type="text"
        placeholder="جستجو نام یا نام خانوادگی"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">نام</th>
              <th className="border p-2">نام خانوادگی</th>
              <th className="border p-2">ایمیل</th>
              <th className="border p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.firstName}</td>
                <td className="border p-2">{user.lastName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => openChangePassword(user)}
                  >
                    تغییر رمز
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* پاپ‌آپ تغییر رمز */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              تغییر رمز {selectedUser?.firstName}
            </h2>
            <input
              type="password"
              placeholder="رمز جدید"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setPopupOpen(false)}
              >
                لغو
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleChangePassword}
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChangeUserPassword;
