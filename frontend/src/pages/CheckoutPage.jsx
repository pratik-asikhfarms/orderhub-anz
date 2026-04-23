import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSummary, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "New Zealand",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isCartEmpty = useMemo(() => cartItems.length === 0, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCartEmpty) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        ...formData,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(payload);
      const order = response.data;

      clearCart();

      navigate("/order-success", {
        state: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
        },
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartEmpty) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <Card className="rounded-2xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-semibold text-slate-900">
                Your cart is empty
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Add products before proceeding to checkout.
              </p>

              <Link to="/" className="mt-6 inline-block">
                <Button className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your details and confirm your pre-order.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <Input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <Input
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="0211234567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Postal Code
                    </label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="1010"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address Line 1
                  </label>
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="123 Queen Street"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address Line 2
                  </label>
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      City
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Auckland"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      State / Region
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Country
                    </label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="New Zealand"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Anything we should know about this order?"
                    className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Order Summary
              </h2>

              <Separator className="my-4" />

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.variantName} × {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-slate-900">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Items</span>
                <span>{cartSummary.totalItems}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>NZD {cartSummary.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default CheckoutPage;