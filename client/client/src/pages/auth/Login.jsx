import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard"); // صفحه موقت
    } catch (err) {
      setError("ایمیل یا رمز عبور اشتباه است", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg w-96 shadow"
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          ورود به حساب کاربری
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="ایمیل"
          className="w-full border p-2 mb-3 rounded text-right"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="رمز عبور"
          className="w-full border p-2 mb-4 rounded text-right"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          ورود
        </button>
      </form>
    </div>
  );
};

export default Login;
