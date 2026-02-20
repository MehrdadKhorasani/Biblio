import api from "./axios";

export const fetchAdminUsers = async (params = {}) => {
  const res = await api.get("/users/admin/users", { params });
  return res.data.users;
};

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data.user;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await api.patch(`/users/admin/users/${userId}/status`);
  return res.data;
};

export const fetchManagerAdmins = async (params = {}) => {
  const res = await api.get("/users/manager/admins", { params });
  return res.data.users;
};

export const createAdmin = async (data) => {
  const res = await api.post("/users/manager/admins", data);
  return res.data.user;
};

// export const fetchManagerUsers = async (params = {}) => {
//   const { search = "" } = params;
//   const response = await api.get(
//     `/manager/users?search=${encodeURIComponent(search)}`,
//   );
//   return response.data.users;
// };

// export const adminChangeUserPassword = async (userId, newPassword) => {
//   await api.patch(`/manager/users/${userId}/password`, { newPassword });
// };
export const fetchManagerUsers = async (params = {}) => {
  const { search = "" } = params;
  const res = await api.get("/users/manager/users", { params: { search } });
  return res.data.users;
};

export const adminChangeUserPassword = async (userId, newPassword) => {
  const res = await api.patch(`/users/manager/users/${userId}/password`, {
    newPassword,
  });
  return res.data;
};
