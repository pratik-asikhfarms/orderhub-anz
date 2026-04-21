import { Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "@/pages/ProductsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminProtectedRoute from "@/routes/AdminProtectedRoute";
import AdminLayout from "@/components/AdminLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;