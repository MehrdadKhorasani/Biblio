/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
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
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
