const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, imageUrl } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      imageUrl: imageUrl || null,
      isActive: true,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    data: products,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);

  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Invalid product id');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  const { name, description, imageUrl, isActive } = req.body;

  const dataToUpdate = {};

  if (name !== undefined) dataToUpdate.name = name;
  if (description !== undefined) dataToUpdate.description = description;
  if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
  if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: dataToUpdate,
  });

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

const disableProduct = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);

  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Invalid product id');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      isActive: false,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Product disabled successfully',
    data: updatedProduct,
  });
});

const getPublicProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    data: products,
  });
});

const getPublicProductById = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);

  if (Number.isNaN(productId)) {
    throw new ApiError(400, 'Invalid product id');
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isActive: true,
    },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  createProduct,
  getAdminProducts,
  updateProduct,
  disableProduct,
  getPublicProducts,
  getPublicProductById,
};