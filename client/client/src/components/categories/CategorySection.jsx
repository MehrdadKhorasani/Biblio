import { categories } from "../../categories";

const CategorySection = () => {
  return (
    <section className="py-10 mx-28" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">
        دسته‌بندی کتاب‌ها 📚
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="bg-white border rounded-lg py-4 text-center font-medium
                       hover:bg-blue-50 hover:border-blue-400 transition"
          >
            {cat.title}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
