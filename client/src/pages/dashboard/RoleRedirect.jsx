import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.roleId === 1) return <Navigate to="orders" replace />;
  if (user.roleId === 2) return <Navigate to="admin" replace />;
  if (user.roleId === 3) return <Navigate to="manager" replace />;

  return <Navigate to="/unauthorized" replace />;
};

export default RoleRedirect;
