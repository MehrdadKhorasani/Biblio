import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// گرفتن state اولیه از localStorage
const getInitialAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return {
      token,
      user: JSON.parse(user),
    };
  }

  return {
    token: null,
    user: null,
  };
};

export const AuthProvider = ({ children }) => {
  const initialAuth = getInitialAuth();

  const [user, setUser] = useState(initialAuth.user);
  const [token, setToken] = useState(initialAuth.token);
  //  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
