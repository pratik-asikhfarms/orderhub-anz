import { useMemo, useState } from "react";
import { ShoppingCart, Trash2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

function ProductCard({ product }) {
  const { addToCart, removeFromCart, isVariantInCart } = useCart();

  const defaultVariantId = product.variants?.[0]?.id?.toString() || "";
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);

  const selectedVariant = useMemo(() => {
    return product.variants?.find(
      (v) => v.id.toString() === selectedVariantId
    );
  }, [product.variants, selectedVariantId]);

  const isAdded = selectedVariant
    ? isVariantInCart(selectedVariant.id)
    : false;

  return (
    <Card className="mx-auto w-full max-w-[240px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">

      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={
            product.imageUrl ||
            "https://via.placeholder.com/800x600?text=No+Image"
          }
          alt={product.name}
          className="h-full w-full object-cover"
        />

        <Badge className="absolute right-2 top-2 text-xs bg-green-100 text-green-700">
          Pre-order
        </Badge>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-slate-900">
          {product.name}
        </h3>

        {/* Variant Dropdown */}
        <select
          value={selectedVariantId}
          onChange={(e) => setSelectedVariantId(e.target.value)}
          className="h-8 w-full rounded-md border border-black/10 px-2 text-xs outline-none focus:border-emerald-600"
        >
          {product.variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.currency} {v.price}
            </option>
          ))}
        </select>

        {/* Price */}
        {selectedVariant && (
          <p className="text-sm font-semibold text-slate-900">
            {selectedVariant.currency} {selectedVariant.price}
          </p>
        )}

        {/* Button */}
        {isAdded ? (
          <Button
            onClick={() => removeFromCart(selectedVariant.id)}
            variant="outline"
            className="h-8 w-full text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        ) : (
          <Button
            onClick={() => addToCart(product, selectedVariant)}
            className="h-8 w-full text-xs bg-green-700 hover:bg-green-800"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;