import axiosInstance from "./axios";

export const registerUser = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};
