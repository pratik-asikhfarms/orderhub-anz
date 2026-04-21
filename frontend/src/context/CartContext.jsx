import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variantId === variant.id
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          imageUrl: product.imageUrl || "",
          variantId: variant.id,
          variantName: variant.name,
          sku: variant.sku,
          price: Number(variant.price),
          currency: variant.currency,
          quantity,
        },
      ];
    });
  };

  const updateCartItemQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isVariantInCart = (variantId) => {
    return cartItems.some((item) => item.variantId === variantId);
  };

  const getCartItemByVariantId = (variantId) => {
    return cartItems.find((item) => item.variantId === variantId);
  };

  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalAmount,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        isVariantInCart,
        getCartItemByVariantId,
        cartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};