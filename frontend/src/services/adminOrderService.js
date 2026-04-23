import api from "@/services/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminOrders = async () => {
  const response = await api.get("/admin/orders", getAuthConfig());
  return response.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`, getAuthConfig());
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    { status },
    getAuthConfig()
  );
  return response.data;
};