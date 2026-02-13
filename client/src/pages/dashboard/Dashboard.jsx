import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import AdminPanel from "./AdminPanel";
import ManagerPanel from "./ManagerPanel";
import UserPanel from "./UserPanel";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderPanel = () => {
    if (user.roleId === 2) return <AdminPanel />;
    if (user.roleId === 3) return <ManagerPanel />;
    return <UserPanel />;
  };

  return (
    <div className="flex" dir="rtl">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen p-6">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-600">
              نقش: {user.roleId === 1 && "کاربر"}
              {user.roleId === 2 && "ادمین"}
              {user.roleId === 3 && "مدیر"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            خروج
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow">{renderPanel()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
