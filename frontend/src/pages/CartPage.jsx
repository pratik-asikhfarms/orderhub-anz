import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    cartSummary,
  } = useCart();

  return (
    <div style={{ padding: '24px' }}>
      <h1>Cart</h1>

      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/">Go to products</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.variantId}
              style={{
                border: '1px solid #ddd',
                padding: '16px',
                marginBottom: '16px',
                borderRadius: '10px',
              }}
            >
              <h3>{item.productName}</h3>
              <p>Variant: {item.variantName}</p>
              <p>SKU: {item.sku}</p>
              <p>
                Price: {item.currency} {item.price}
              </p>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() =>
                    updateCartItemQuantity(item.variantId, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartItemQuantity(item.variantId, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button onClick={() => removeFromCart(item.variantId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total: NZD {cartSummary.totalAmount.toFixed(2)}</h2>
          <Link to="/checkout">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default CartPage;