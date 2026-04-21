const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(admin);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    },
  });
});

module.exports = {
  loginAdmin,
};