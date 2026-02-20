import api from "./axios";
import axiosInstance from "./axios";

export const fetchOrderStatusReport = async (params = {}) => {
  const res = await api.get("/reports/order-status", { params });
  return res.data.report;
};

export const fetchBookStockReport = async ({
  bookId,
  page = 1,
  limit = 10,
}) => {
  const res = await axiosInstance.get("/reports/book-stock", {
    params: { bookId, page, limit },
  });
  return res.data.report;
};

export const fetchUserActivityReport = async ({
  actorId,
  targetUserId,
  page = 1,
  limit = 10,
}) => {
  const res = await api.get("/reports/user-activities", {
    params: { actorId, targetUserId, page, limit },
  });
  return res.data.logs; // یا res.data، بسته به response backend
};
