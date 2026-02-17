import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <div>در حال بارگذاری...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.roleId))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default PrivateRoute;
