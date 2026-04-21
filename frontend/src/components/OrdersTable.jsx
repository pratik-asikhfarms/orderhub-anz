import React, { useState } from 'react';
import './OrdersTable.css';

const OrdersTable = ({ orders, onStatusUpdate, onDelete }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr className="order-row">
                <td>
                  <button
                    className="order-expand-button"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {expandedOrder === order.id ? 'v' : '>'}
                  </button>
                  #{order.id}
                </td>
                <td>{order.customerName || 'Guest'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    className={`status-select ${getStatusColor(order.status)}`}
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div className="order-actions">
                    <button
                      className="delete-order-button"
                      onClick={() => onDelete(order.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              
              {expandedOrder === order.id && (
                <tr className="order-details">
                  <td colSpan="6">
                    <div className="order-details-content">
                      <div className="order-info">
                        <h4>Order Details</h4>
                        <p><strong>Email:</strong> {order.customerEmail || 'N/A'}</p>
                        <p><strong>Phone:</strong> {order.customerPhone || 'N/A'}</p>
                        <p><strong>Shipping Address:</strong> {order.shippingAddress || 'N/A'}</p>
                      </div>
                      
                      <div className="order-items">
                        <h4>Items</h4>
                        <div className="items-list">
                          {order.items?.map((item, index) => (
                            <div key={index} className="order-item">
                              <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                {item.variant && (
                                  <span className="item-variant">
                                    {item.variant.name}: {item.variant.value}
                                  </span>
                                )}
                              </div>
                              <div className="item-details">
                                <span className="item-quantity">Qty: {item.quantity}</span>
                                <span className="item-price">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className="item-total">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="order-summary">
                        <h4>Summary</h4>
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>${order.shipping?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-row">
                          <span>Tax:</span>
                          <span>${order.tax?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {orders.length === 0 && (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
