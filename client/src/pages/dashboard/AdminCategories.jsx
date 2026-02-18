import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const AdminCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Load all categories (active + inactive) with book count
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      alert("مشکلی در دریافت دسته‌بندی‌ها پیش آمد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggle = async (id) => {
    try {
      await api.patch(`/categories/${id}/status`);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert("خطا در تغییر وضعیت دسته‌بندی");
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
    setEditDesc(category.description || "");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
  };

  const handleSaveEdit = async (id) => {
    try {
      await api.put(`/categories/${id}`, {
        name: editName,
        description: editDesc,
      });
      setEditId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "خطا در ذخیره تغییرات");
    }
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">دسته‌بندی‌ها</h1>
        <button
          onClick={() => navigate("/dashboard/admin/categories/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          دسته‌بندی جدید
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          در حال بارگذاری...
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-4">نام</th>
                <th className="p-4">توضیح</th>
                <th className="p-4">تعداد کتاب‌ها</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Name & Description */}
                  <td className="p-4">
                    {editId === cat.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="p-4">
                    {editId === cat.id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                      />
                    ) : (
                      cat.description || "-"
                    )}
                  </td>
                  {/* Book count */}
                  <td className="p-4 text-gray-700 font-medium">
                    {toPersianNumber(cat.bookcount) || 0}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cat.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 space-x-2">
                    {editId === cat.id ? (
                      <>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleSaveEdit(cat.id)}
                        >
                          ذخیره
                        </button>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm"
                          onClick={handleCancelEdit}
                        >
                          لغو
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleEdit(cat)}
                        >
                          ویرایش
                        </button>
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                          onClick={() => handleToggle(cat.id)}
                        >
                          {cat.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
