import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* راست: لوگو */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          📚 بیبلیو
        </Link>

        {/* وسط: سرچ */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-1/3">
          <Search size={18} className="text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="جستجوی کتاب..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* چپ: اکشن‌ها */}
        <div className="flex items-center gap-4">
          <button className="relative">
            <ShoppingCart className="text-gray-700" />
            {/* badge بعداً */}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600"
            >
              <User size={18} />
              داشبورد
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
