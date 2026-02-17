/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const getInitialAuth = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;

  try {
    if (userString) {
      user = JSON.parse(userString);
    }
  } catch (err) {
    console.error("Invalid user in localStorage", err);
    localStorage.removeItem("user");
  }

  if (token && user) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return {
      token,
      user,
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const { token, user } = getInitialAuth();
    setToken(token);
    setUser(user);
    setAuthLoading(false);
  }, []);

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
      value={{
        user,
        token,
        login,
        logout,
        setUser,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
