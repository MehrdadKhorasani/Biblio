import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSettings = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert("مشکلی در دریافت اطلاعات پروفایل پیش آمد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const res = await api.patch("/users/me", {
        firstName: user.firstName,
        lastName: user.lastName,
      });
      setUser(res.data.user);
      setEditing(false);
      alert("اطلاعات پروفایل با موفقیت بروزرسانی شد");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "خطا در بروزرسانی پروفایل");
    }
  };

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("رمز جدید و تکرار آن همخوانی ندارند");
    }

    try {
      await api.patch("/users/me/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("رمز عبور با موفقیت تغییر کرد");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "خطا در تغییر رمز عبور");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">در حال بارگذاری...</div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">تنظیمات کاربری</h1>

      {/* Profile */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">اطلاعات پروفایل</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">اسم کوچک</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">نام خانوادگی</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="mt-4 space-x-2">
          {editing ? (
            <>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={saveProfile}
              >
                ذخیره
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                onClick={() => setEditing(false)}
              >
                لغو
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => setEditing(true)}
            >
              ویرایش
            </button>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">تغییر رمز عبور</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">رمز فعلی</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">رمز جدید</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">تکرار رمز جدید</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={changePassword}
          >
            تغییر رمز عبور
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
