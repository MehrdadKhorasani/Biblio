import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.roleId === 1) {
      navigate("/dashboard/orders", { replace: true });
    } else if (user.roleId === 2) {
      navigate("/dashboard/admin/orders", { replace: true });
    } else if (user.roleId === 3) {
      navigate("/dashboard/manager", { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default RoleRedirect;
