import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("ایمیل یا رمز عبور اشتباه است", err);
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        dir="rtl"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow w-full max-w-md text-right"
        >
          <h1 className="text-2xl font-bold mb-6">ورود</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            type="email"
            placeholder="ایمیل"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="رمز عبور"
            className="w-full border p-2 mb-6 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            ورود
          </button>
          <p className="text-sm mt-4 text-center">
            <Link to="/register" className="text-indigo-600">
              ثبت‌نام کنید
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
