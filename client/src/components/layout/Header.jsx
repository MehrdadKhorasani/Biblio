import { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toPersianNumber } from "../../utils/toPersianNumbers";

const Header = () => {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleKeyDown = async (e) => {
    if (e.code === "Enter") {
      navigate(`/search?search=${search}`, { replace: true });
    }
  };

  const searchHandler = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  console.log(search);

  return (
    <header className="w-full bg-white shadow-sm" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          📚 بیبلیو
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-1/3">
          <Search size={18} className="text-gray-500 ml-2" />
          <input
            onKeyDown={handleKeyDown}
            onChange={searchHandler}
            value={search}
            type="text"
            placeholder="جستجوی کتاب..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* چپ: اکشن‌ها */}
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <div className="relative">
              <ShoppingCart className="text-gray-700" size={22} />
              {totalQuantity > 0 && (
                <span
                  className="absolute -top-2 -left-2 bg-red-500 text-white 
              text-[10px] min-w-[18px] h-5 px-1 flex items-center justify-center rounded-full"
                >
                  {toPersianNumber(totalQuantity)}
                </span>
              )}
            </div>
          </Link>

          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600"
            >
              <User size={18} />
              داشبورد
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-sm text-indigo-600 hover:underline"
              >
                ورود
              </Link>
              <Link
                to="/register"
                className="text-sm text-indigo-600 hover:underline"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
