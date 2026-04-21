import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/services/productService";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data || []);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8f6]">
      <section className="mx-auto max-w-6xl px-4 py-8">

        {/* Hero (reduced size) */}
        <div className="mb-6 rounded-xl border border-black/10 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-700">
            Fresh produce, variant-based pre-orders
          </p>

          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            Premium produce, beautifully ordered.
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Browse products, choose your pack size, and place your pre-order in seconds.
          </p>
        </div>

        {/* States */}
        {loading ? (
          <div className="py-10 text-sm text-slate-500">
            Loading products...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductsPage;