import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const NewCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("نام دسته‌بندی نمی‌تواند خالی باشد");
      return;
    }

    setLoading(true);

    try {
      await api.post("/categories", { name, description });
      alert("دسته‌بندی با موفقیت ایجاد شد");
      navigate("/dashboard/categories"); // بازگشت به لیست
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "خطا در ایجاد دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">دسته‌بندی جدید</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 max-w-lg mx-auto space-y-4"
      >
        <div>
          <label className="block text-gray-700 mb-1">نام دسته‌بندی</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="نام دسته‌بندی"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">توضیح</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="توضیح دسته‌بندی (اختیاری)"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/categories")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            لغو
          </button>

          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ایجاد دسته‌بندی"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategory;
