import { useEffect, useState } from "react";
import { Plus, Package, Tag, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createProduct,
  createVariant,
  updateProductStatus,
  updateVariantStatus,
  getAdminProducts,
} from "@/services/adminProductService";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [variantForms, setVariantForms] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setPageError("");
      const response = await getAdminProducts();
      setProducts(response.data || []);
    } catch (error) {
      setPageError(
        error?.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      setIsSubmittingProduct(true);
      await createProduct(productForm);

      setProductForm({
        name: "",
        description: "",
        imageUrl: "",
      });

      fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleVariantInputChange = (productId, field, value) => {
    setVariantForms((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleCreateVariant = async (e, productId) => {
    e.preventDefault();

    const form = variantForms[productId] || {
      name: "",
      sku: "",
      price: "",
      currency: "NZD",
    };

    try {
      await createVariant(productId, {
        name: form.name || "",
        sku: form.sku || "",
        price: Number(form.price),
        currency: form.currency || "NZD",
      });

      setVariantForms((prev) => ({
        ...prev,
        [productId]: {
          name: "",
          sku: "",
          price: "",
          currency: "NZD",
        },
      }));

      fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to create variant");
    }
  };

  const handleToggleProductStatus = async (productId, isActive) => {
    try {
      await updateProductStatus(productId, isActive);
      fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update product status");
    }
  };

  const handleToggleVariantStatus = async (variantId, isActive) => {
    try {
      await updateVariantStatus(variantId, isActive);
      fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update variant status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create products, add variants, and manage availability.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-700" />
            <h2 className="text-lg font-semibold">Create Product</h2>
          </div>

          <form
            onSubmit={handleCreateProduct}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Product Name
              </label>
              <Input
                name="name"
                value={productForm.name}
                onChange={handleProductChange}
                placeholder="Shahi Litchi"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <Input
                name="imageUrl"
                value={productForm.imageUrl}
                onChange={handleProductChange}
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                placeholder="Optional short description"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
                disabled={isSubmittingProduct}
              >
                {isSubmittingProduct ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          All Products
        </h2>

        {loading ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
            Loading products...
          </div>
        ) : pageError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
            No products found.
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const variantForm = variantForms[product.id] || {
                name: "",
                sku: "",
                price: "",
                currency: "NZD",
              };

              return (
                <Card key={product.id} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                              <img
                                src={
                                  product.imageUrl ||
                                  "https://via.placeholder.com/200x200?text=No+Image"
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-slate-500" />
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {product.name}
                                </h3>
                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                {product.description || "No description"}
                              </p>

                              <div className="mt-2">
                                <Badge
                                  className={
                                    product.isActive
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-200 text-slate-700"
                                  }
                                >
                                  {product.isActive ? "Active" : "Disabled"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            className={`rounded-xl ${product.isActive
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                              }`}
                            onClick={() => handleToggleProductStatus(product.id, !product.isActive)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {product.isActive ? "Disable" : "Enable"}
                          </Button>
                        </div>

                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-500" />
                            <h4 className="font-medium text-slate-900">
                              Variants
                            </h4>
                          </div>

                          {product.variants?.length > 0 ? (
                            <div className="space-y-2">
                              {product.variants.map((variant) => (
                                <div
                                  key={variant.id}
                                  className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {variant.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      SKU: {variant.sku}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {variant.currency} {variant.price}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <Badge
                                      className={
                                        variant.isActive
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-slate-200 text-slate-700"
                                      }
                                    >
                                      {variant.isActive ? "Active" : "Disabled"}
                                    </Badge>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`rounded-lg ${variant.isActive
                                          ? "text-red-600 border-red-200 hover:bg-red-50"
                                          : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                        }`}
                                      onClick={() => handleToggleVariantStatus(variant.id, !variant.isActive)}
                                    >
                                      {variant.isActive ? "Disable" : "Enable"}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-500">
                              No variants added yet.
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <h4 className="font-medium text-slate-900">
                            Add Variant
                          </h4>
                          <p className="text-sm text-slate-500">
                            Create pack sizes with SKU and price.
                          </p>
                        </div>

                        <form
                          onSubmit={(e) => handleCreateVariant(e, product.id)}
                          className="space-y-4"
                        >
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Variant Name
                            </label>
                            <Input
                              value={variantForm.name}
                              onChange={(e) =>
                                handleVariantInputChange(
                                  product.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="500gm"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              SKU
                            </label>
                            <Input
                              value={variantForm.sku}
                              onChange={(e) =>
                                handleVariantInputChange(
                                  product.id,
                                  "sku",
                                  e.target.value
                                )
                              }
                              placeholder="LITCHI-500GM"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Price
                              </label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variantForm.price}
                                onChange={(e) =>
                                  handleVariantInputChange(
                                    product.id,
                                    "price",
                                    e.target.value
                                  )
                                }
                                placeholder="14.99"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Currency
                              </label>
                              <Input
                                value={variantForm.currency}
                                onChange={(e) =>
                                  handleVariantInputChange(
                                    product.id,
                                    "currency",
                                    e.target.value
                                  )
                                }
                                placeholder="NZD"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
                          >
                            Add Variant
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;