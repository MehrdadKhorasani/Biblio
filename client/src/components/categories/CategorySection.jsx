import { useEffect, useState } from "react";
import axios from "axios";

const CategorySection = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories",
        );

        // فقط دسته‌بندی‌های فعال
        const activeCategories = response.data.categories.filter(
          (cat) => cat.isActive,
        );

        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-10 mx-28" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">دسته‌بندی کتاب‌ها</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* دکمه همه */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`border rounded-lg py-4 text-center font-medium
                     hover:bg-blue-50 hover:border-blue-400 transition ${
                       selectedCategory === null
                         ? "bg-blue-100 border-blue-500"
                         : ""
                     }`}
        >
          همه
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`bg-white border rounded-lg py-4 text-center font-medium
                       hover:bg-blue-50 hover:border-blue-400 transition ${
                         selectedCategory === cat.id
                           ? "bg-blue-100 border-blue-500"
                           : ""
                       }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
