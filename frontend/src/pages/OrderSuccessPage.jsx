import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state;

  if (!state?.orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-semibold text-slate-900">
              Order placed successfully
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Thank you{state.customerName ? `, ${state.customerName}` : ""}.
              Your pre-order has been received.
            </p>

            <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Order Number</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {state.orderNumber}
              </p>

              <p className="mt-4 text-sm text-slate-500">Order Total</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                NZD {Number(state.totalAmount || 0).toFixed(2)}
              </p>
            </div>

            <div className="mt-8">
              <Link to="/">
                <Button className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default OrderSuccessPage;