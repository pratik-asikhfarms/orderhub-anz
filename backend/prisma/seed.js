require('dotenv').config();
const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding started...");

  const passwordHash = await bcrypt.hash('Admin@2026!', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@asikhfarms.in' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@asikhfarms.in',
      passwordHash,
    },
  });

  console.log("✅ Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });