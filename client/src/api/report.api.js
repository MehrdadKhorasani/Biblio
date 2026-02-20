import api from "./axios";

export const fetchOrderStatusReport = async (params = {}) => {
  const res = await api.get("/reports/order-status", { params });
  return res.data.report;
};
