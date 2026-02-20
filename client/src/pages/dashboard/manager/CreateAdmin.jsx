import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../../api/user.api";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createAdmin(formData);
      navigate("/dashboard/manager/admins");
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ساخت ادمین");
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded shadow w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            ایجاد ادمین جدید
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="نام"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="نام خانوادگی"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              ایجاد ادمین
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAdmin;
