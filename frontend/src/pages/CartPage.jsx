import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";

function CartPage() {
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    cartSummary,
  } = useCart();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
            <p className="text-sm text-muted-foreground">
              Review selected variants before checkout.
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="rounded-3xl">
            <CardContent className="flex flex-col items-start gap-4 p-8">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link to="/">
                <Button className="rounded-xl">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.variantId} className="rounded-3xl">
                  <CardContent className="flex flex-col gap-5 p-5 sm:flex-row">
                    <img
                      src={
                        item.imageUrl ||
                        "https://via.placeholder.com/240x180?text=No+Image"
                      }
                      alt={item.productName}
                      className="h-32 w-full rounded-2xl object-cover sm:w-40"
                    />

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                        <p className="text-sm font-medium">
                          {item.currency} {item.price}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                            onClick={() =>
                              updateCartItemQuantity(
                                item.variantId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <div className="min-w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                            onClick={() =>
                              updateCartItemQuantity(
                                item.variantId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold">
                            {item.currency} {(item.price * item.quantity).toFixed(2)}
                          </p>

                          <Button
                            variant="ghost"
                            className="rounded-xl text-red-600 hover:text-red-700"
                            onClick={() => removeFromCart(item.variantId)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit rounded-3xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{cartSummary.totalItems}</span>
                  </div>

                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>NZD {cartSummary.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="mt-6 block">
                  <Button className="w-full rounded-xl" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}

export default CartPage;