import { useState } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id || ''
  );

  const selectedVariant = product.variants?.find(
    (variant) => variant.id === Number(selectedVariantId)
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        background: '#fff',
      }}
    >
      <img
        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
        style={{
          width: '100%',
          height: '220px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      {product.variants?.length > 0 ? (
        <>
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} - {variant.currency} {variant.price}
              </option>
            ))}
          </select>

          <button onClick={handleAddToCart} style={{ width: '100%', padding: '10px' }}>
            Add to Cart
          </button>
        </>
      ) : (
        <p>No variants available</p>
      )}
    </div>
  );
}

export default ProductCard;