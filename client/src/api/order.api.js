import axiosInstance from "./axios";

export const createOrder = async (data) => {
  const res = await axiosInstance.post("/orders", data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my");
  return res.data;
};
