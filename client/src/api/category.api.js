import api from "./axios";
// گرفتن همه دسته‌بندی‌ها
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories"); // مسیر API بک‌اند شما
    return response.data; // فرض می‌کنیم پاسخ یه آرایه از دسته‌بندی‌هاست: [{id, name}, ...]
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};
