import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Package, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";

function AdminSidebar() {
  const location = useLocation();
  const { logout, admin } = useAdminAuth();

  const navItems = [
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Admin Panel</p>
            <p className="text-xs text-slate-500">{admin?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;