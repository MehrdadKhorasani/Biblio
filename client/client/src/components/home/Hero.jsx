import { Search } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          دنیای کتاب‌ها، یک‌جا در بیبلیو{" "}
        </h1>

        <p className="text-sm md:text-lg text-indigo-100 mb-8">
          جستجو، مقایسه و خرید کتاب‌های مورد علاقه‌ات با چند کلیک ساده
        </p>

        {/* سرچ بزرگ */}
        <div className="max-w-xl mx-auto bg-white rounded-xl flex items-center px-4 py-3 shadow-lg">
          <Search className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="نام کتاب، نویسنده یا دسته‌بندی..."
            className="w-full outline-none text-gray-700 text-sm md:text-base"
          />
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
            مشاهده کتاب‌ها
          </button>

          <button className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition">
            دسته‌بندی‌ها
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
