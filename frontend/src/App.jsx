import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import AppRoutes from "@/routes/AppRoutes";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;