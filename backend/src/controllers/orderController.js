const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateOrderNumber = require('../utils/generatedOrderNumber');

const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    notes,
    items,
  } = req.body;

  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  if (products.length !== items.length) {
    throw new ApiError(400, 'One or more products are invalid');
  }

  const productMap = {};
  products.forEach((product) => {
    productMap[product.id] = product;
  });

  let totalAmount = 0;

  const orderItemsData = items.map((item) => {
    const product = productMap[item.productId];
    const quantity = Number(item.quantity);

    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      throw new ApiError(400, 'Invalid quantity');
    }

    const unitPrice = Number(product.price);
    const lineTotal = unitPrice * quantity;

    totalAmount += lineTotal;

    return {
      productId: product.id,
      productName: product.name,
      unitPrice,
      quantity,
      lineTotal,
    };
  });

  const createdOrder = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2: addressLine2 || null,
      city,
      state: state || null,
      postalCode,
      country: country || 'New Zealand',
      notes: notes || null,
      totalAmount,
      orderItems: {
        create: orderItemsData,
      },
    },
    include: {
      orderItems: true,
    },
  });

  const orderNumber = generateOrderNumber(createdOrder.id);

  const finalOrder = await prisma.order.update({
    where: { id: createdOrder.id },
    data: { orderNumber },
    include: {
      orderItems: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: finalOrder,
  });
});

const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json({
    success: true,
    data: orders,
  });
});

const getAdminOrderById = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);

  if (Number.isNaN(orderId)) {
    throw new ApiError(400, 'Invalid order id');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return res.status(200).json({
    success: true,
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (Number.isNaN(orderId)) {
    throw new ApiError(400, 'Invalid order id');
  }

  const allowedStatuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED',
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${allowedStatuses.join(', ')}`);
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!existingOrder) {
    throw new ApiError(404, 'Order not found');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder,
  });
});

module.exports = {
  createOrder,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
};