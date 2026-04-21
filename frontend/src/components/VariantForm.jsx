import React, { useState } from 'react';
import './VariantForm.css';

const VariantForm = ({ variants, onChange }) => {
  const [newVariant, setNewVariant] = useState({
    name: '',
    value: '',
    price: '',
    stock: ''
  });

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.value) {
      const variant = {
        id: Date.now(),
        name: newVariant.name,
        value: newVariant.value,
        price: parseFloat(newVariant.price) || 0,
        stock: parseInt(newVariant.stock) || 0
      };
      
      onChange([...variants, variant]);
      setNewVariant({ name: '', value: '', price: '', stock: '' });
    }
  };

  const handleRemoveVariant = (variantId) => {
    onChange(variants.filter(v => v.id !== variantId));
  };

  const handleNewVariantChange = (field, value) => {
    setNewVariant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="variant-form">
      <div className="variants-list">
        {variants.map((variant) => (
          <div key={variant.id} className="variant-item">
            <div className="variant-info">
              <span className="variant-name">{variant.name}: {variant.value}</span>
              <span className="variant-price">${variant.price}</span>
              <span className="variant-stock">Stock: {variant.stock}</span>
            </div>
            <button
              type="button"
              className="remove-variant-button"
              onClick={() => handleRemoveVariant(variant.id)}
            >
              Remove
            </button>
          </div>
        ))}
        
        {variants.length === 0 && (
          <p className="no-variants">No variants added yet</p>
        )}
      </div>

      <div className="add-variant">
        <h4>Add New Variant</h4>
        <div className="variant-inputs">
          <input
            type="text"
            placeholder="Variant name (e.g., Size, Color)"
            value={newVariant.name}
            onChange={(e) => handleNewVariantChange('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Variant value (e.g., Large, Red)"
            value={newVariant.value}
            onChange={(e) => handleNewVariantChange('value', e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={newVariant.price}
            onChange={(e) => handleNewVariantChange('price', e.target.value)}
            step="0.01"
            min="0"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) => handleNewVariantChange('stock', e.target.value)}
            min="0"
          />
          <button
            type="button"
            className="add-variant-button"
            onClick={handleAddVariant}
            disabled={!newVariant.name || !newVariant.value}
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantForm;
