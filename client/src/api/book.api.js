import api from "./axios";

export const fetchBooks = async (params = {}) => {
  // params: { search, author, categoryId, minPrice, maxPrice, sortBy, order, page, limit, includeDeleted }
  const res = await api.get("/books", { params });
  return res.data;
};

export const fetchBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data.book;
};

export const createBook = async (bookData) => {
  const res = await api.post("/books", bookData);
  return res.data.book;
};

export const updateBook = async (id, updates) => {
  const res = await api.patch(`/books/${id}`, updates);
  return res.data.book;
};

export const toggleBookAvailability = async (id) => {
  const res = await api.patch(`/books/${id}/availability`);
  return res.data.book;
};

export const updateBookStock = async (id, amount, note) => {
  const res = await api.patch(`/books/${id}/stock`, { amount, note });
  return res.data.book;
};

export const softDeleteBook = async (id) => {
  const res = await api.delete(`/books/${id}`);
  return res.data.book;
};

export const restoreBook = async (id) => {
  const res = await api.patch(`/books/${id}/restore`);
  return res.data.book;
};

export const fetchBookStockHistory = async (id) => {
  const res = await api.get(`/books/${id}/stock-history`);
  return res.data.logs;
};
