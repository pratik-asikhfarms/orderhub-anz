import api from "@/services/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminProducts = async () => {
  const response = await api.get("/admin/products", getAuthConfig());
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post("/admin/products", payload, getAuthConfig());
  return response.data;
};

export const disableProduct = async (productId) => {
  const response = await api.patch(
    `/admin/products/${productId}/disable`,
    {},
    getAuthConfig()
  );
  return response.data;
};

export const createVariant = async (productId, payload) => {
  const response = await api.post(
    `/admin/products/${productId}/variants`,
    payload,
    getAuthConfig()
  );
  return response.data;
};

export const disableVariant = async (variantId) => {
  const response = await api.patch(
    `/admin/variants/${variantId}/disable`,
    {},
    getAuthConfig()
  );
  return response.data;
};