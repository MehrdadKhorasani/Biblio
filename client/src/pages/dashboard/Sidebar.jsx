import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6 text-center">پنل کاربری</h2>

      <ul className="space-y-3">
        {/* مشترک */}
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
          داشبورد
        </li>

        {/* USER */}
        {user.roleId === 1 && (
          <>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              سفارش‌های من
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              پروفایل
            </li>
          </>
        )}

        {/* ADMIN */}
        {user.roleId === 2 && (
          <>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              مدیریت کتاب‌ها
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              دسته‌بندی‌ها
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              سفارش‌ها
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
