import { useEffect, useState } from "react";
import {
  ShoppingBag,
  User,
  MapPin,
  Package2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "@/services/adminOrderService";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
      return "bg-purple-100 text-purple-700";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setPageError("");
      const response = await getAdminOrders();
      setOrders(response.data || []);
    } catch (error) {
      setPageError(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleToggleDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setSelectedOrder(null);
      return;
    }

    try {
      setDetailsLoading(true);
      const response = await getAdminOrderById(orderId);
      setSelectedOrder(response.data);
      setExpandedOrderId(orderId);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setStatusUpdatingId(orderId);
      await updateOrderStatus(orderId, nextStatus);

      await fetchOrders();

      if (expandedOrderId === orderId) {
        const response = await getAdminOrderById(orderId);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update order status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          View all orders and manage their status.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
          Loading orders...
        </div>
      ) : pageError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {pageError}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <Card key={order.id} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-slate-500" />
                        <h2 className="text-lg font-semibold text-slate-900">
                          {order.orderNumber || `Order #${order.id}`}
                        </h2>
                      </div>

                      <p className="text-sm text-slate-500">
                        {order.customerName} • {order.customerEmail}
                      </p>

                      <p className="text-sm text-slate-500">
                        Created on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </Badge>

                      <p className="text-sm font-medium text-slate-900">
                        NZD {Number(order.totalAmount).toFixed(2)}
                      </p>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleToggleDetails(order.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            View Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 border-t pt-6">
                      {detailsLoading || !selectedOrder ? (
                        <div className="text-sm text-slate-500">
                          Loading order details...
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-xl border bg-slate-50 p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-500" />
                                <h3 className="font-medium text-slate-900">
                                  Customer
                                </h3>
                              </div>

                              <div className="space-y-1 text-sm text-slate-600">
                                <p>{selectedOrder.customerName}</p>
                                <p>{selectedOrder.customerEmail}</p>
                                <p>{selectedOrder.customerPhone}</p>
                              </div>
                            </div>

                            <div className="rounded-xl border bg-slate-50 p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                <h3 className="font-medium text-slate-900">
                                  Delivery Address
                                </h3>
                              </div>

                              <div className="space-y-1 text-sm text-slate-600">
                                <p>{selectedOrder.addressLine1}</p>
                                {selectedOrder.addressLine2 ? (
                                  <p>{selectedOrder.addressLine2}</p>
                                ) : null}
                                <p>
                                  {selectedOrder.city}
                                  {selectedOrder.state
                                    ? `, ${selectedOrder.state}`
                                    : ""}
                                </p>
                                <p>{selectedOrder.postalCode}</p>
                                <p>{selectedOrder.country}</p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-white p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <Package2 className="h-4 w-4 text-slate-500" />
                              <h3 className="font-medium text-slate-900">
                                Order Items
                              </h3>
                            </div>

                            <div className="space-y-3">
                              {selectedOrder.orderItems?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {item.variantName} • SKU: {item.sku}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                      Unit Price
                                    </p>
                                    <p className="text-sm font-medium text-slate-900">
                                      NZD {Number(item.unitPrice).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      Line Total: NZD{" "}
                                      {Number(item.lineTotal).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedOrder.notes ? (
                            <div className="rounded-xl border bg-amber-50 p-4">
                              <p className="text-sm font-medium text-slate-900">
                                Customer Notes
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {selectedOrder.notes}
                              </p>
                            </div>
                          ) : null}

                          <div className="flex flex-col gap-3 rounded-xl border bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                Update Order Status
                              </p>
                              <p className="text-xs text-slate-500">
                                Change the current status of this order.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {ORDER_STATUSES.map((status) => (
                                <Button
                                  key={status}
                                  variant={
                                    selectedOrder.status === status
                                      ? "default"
                                      : "outline"
                                  }
                                  className="rounded-xl"
                                  disabled={
                                    statusUpdatingId === selectedOrder.id ||
                                    selectedOrder.status === status
                                  }
                                  onClick={() =>
                                    handleStatusChange(selectedOrder.id, status)
                                  }
                                >
                                  {statusUpdatingId === selectedOrder.id &&
                                  selectedOrder.status !== status
                                    ? "Updating..."
                                    : status}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;