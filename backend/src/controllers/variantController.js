const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createVariant = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);

  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Invalid product id');
  }

  const { name, sku, price, currency } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const existingSku = await prisma.productVariant.findUnique({
    where: { sku },
  });

  if (existingSku) {
    throw new ApiError(400, 'SKU already exists');
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, 'Price must be a valid non-negative number');
  }

  const variant = await prisma.productVariant.create({
    data: {
      productId,
      name,
      sku,
      price: numericPrice,
      currency: currency || 'NZD',
      isActive: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Variant created successfully',
    data: variant,
  });
});

const getProductVariants = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);

  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Invalid product id');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: {
      createdAt: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: variants,
  });
});

const updateVariant = asyncHandler(async (req, res) => {
  const variantId = Number(req.params.id);

  if (Number.isNaN(variantId)) {
    throw new ApiError(400, 'Invalid variant id');
  }

  const existingVariant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!existingVariant) {
    throw new ApiError(404, 'Variant not found');
  }

  const { name, sku, price, currency, isActive } = req.body;

  const dataToUpdate = {};

  if (name !== undefined) dataToUpdate.name = name;
  if (currency !== undefined) dataToUpdate.currency = currency;
  if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

  if (sku !== undefined) {
    const duplicateSku = await prisma.productVariant.findFirst({
      where: {
        sku,
        id: { not: variantId },
      },
    });

    if (duplicateSku) {
      throw new ApiError(400, 'SKU already exists');
    }

    dataToUpdate.sku = sku;
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      throw new ApiError(400, 'Price must be a valid non-negative number');
    }

    dataToUpdate.price = numericPrice;
  }

  const updatedVariant = await prisma.productVariant.update({
    where: { id: variantId },
    data: dataToUpdate,
  });

  res.status(200).json({
    success: true,
    message: 'Variant updated successfully',
    data: updatedVariant,
  });
});

const disableVariant = asyncHandler(async (req, res) => {
  const variantId = Number(req.params.id);

  if (Number.isNaN(variantId)) {
    throw new ApiError(400, 'Invalid variant id');
  }

  const existingVariant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!existingVariant) {
    throw new ApiError(404, 'Variant not found');
  }

  const updatedVariant = await prisma.productVariant.update({
    where: { id: variantId },
    data: { isActive: false },
  });

  res.status(200).json({
    success: true,
    message: 'Variant disabled successfully',
    data: updatedVariant,
  });
});

module.exports = {
  createVariant,
  getProductVariants,
  updateVariant,
  disableVariant,
};