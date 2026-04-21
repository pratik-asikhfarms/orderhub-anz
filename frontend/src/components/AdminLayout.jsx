import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";

function AdminLayout() {
  return (
    <div className="h-screen bg-slate-50">
      <div className="flex h-full">
        <div className="shrink-0">
          <AdminSidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;