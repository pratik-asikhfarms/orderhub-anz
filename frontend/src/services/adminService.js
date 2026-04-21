import api from "@/services/api";

export const adminLogin = async (payload) => {
  const response = await api.post("/admin/login", payload);
  return response.data;
};