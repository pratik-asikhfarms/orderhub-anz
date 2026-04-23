import api from "@/services/api";

export const createOrder = async (payload) => {
  const response = await api.post("/orders", payload);
  return response.data;
};