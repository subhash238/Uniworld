const { PrismaClient } = require("@prisma/client");
// const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@uniworld.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@uniworld.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin seeded:", admin.email);

  // Seed some categories
  const categories = [
    { name: "CCTV Camera", slug: "cctv-camera", description: "High quality CCTV cameras for surveillance" },
    { name: "IP Camera", slug: "ip-camera", description: "Network IP cameras with remote monitoring" },
    { name: "DVR", slug: "dvr", description: "Digital Video Recorders for CCTV systems" },
    { name: "NVR", slug: "nvr", description: "Network Video Recorders for IP camera systems" },
    { name: "Access Control", slug: "access-control", description: "Door access control and biometric systems" },
    { name: "Cables & Accessories", slug: "cables-accessories", description: "Cables, connectors and accessories" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
