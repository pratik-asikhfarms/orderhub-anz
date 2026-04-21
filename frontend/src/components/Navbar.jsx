import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

function Navbar() {
  const { cartSummary } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">OrderHub NZ</p>
            <p className="text-xs text-muted-foreground">
              Premium pre-orders made simple
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost">Products</Button>
          </Link>

          <Link to="/cart">
            <Button className="gap-2 rounded-xl">
              <ShoppingBag className="h-4 w-4" />
              Cart
              <Badge
                variant="secondary"
                className="ml-1 rounded-full px-2 py-0.5"
              >
                {cartSummary.totalItems}
              </Badge>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;