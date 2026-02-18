import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6 text-center">پنل کاربری</h2>

      <ul className="space-y-3">
        {/* مشترک */}
        <li>
          <Link to="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
            داشبورد
          </Link>
        </li>

        {/* USER */}
        {user.roleId === 1 && (
          <>
            <li>
              <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
                بازگشت به فروشگاه
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/orders"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                سفارش‌های من
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/profile"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                پروفایل
              </Link>
            </li>
          </>
        )}

        {/* ADMIN */}
        {user.roleId === 2 && (
          <>
            <li>
              <Link
                to="/dashboard/admin/orders"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                مدیریت سفارش‌ها
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/admin/books"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                مدیریت کتاب‌ها
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/admin/users"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                مدیریت کاربران
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/admin/categories"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                مدیریت دسته‌بندی‌ها
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/admin/settings"
                className="block hover:bg-gray-700 p-2 rounded"
              >
                تنظیمات حساب کاربری
              </Link>
            </li>
          </>
        )}

        {/* MANAGER */}
        {user.roleId === 3 && (
          <>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              گزارش‌ها
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              مدیریت کاربران
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              همه سفارش‌ها
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
