const express = require('express');
const cors = require('cors');
const prisma = require('./config/prisma');

const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminVariantRoutes = require('./routes/adminVariantRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: 'Backend server and database are running',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminProductRoutes);
app.use('/api/admin', adminVariantRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

module.exports = app;