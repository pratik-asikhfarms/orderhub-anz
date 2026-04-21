import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

function AdminProtectedRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;