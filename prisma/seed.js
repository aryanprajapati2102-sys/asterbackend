import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@asterhomes.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  await prisma.room.deleteMany();
  await prisma.room.createMany({
    data: [
      {
        title: "Single Room - Premium",
        description: "Private single occupancy room with attached washroom and study setup.",
        price: 16500,
        occupancy: "Single",
        amenities: ["AC", "WiFi", "Laundry", "Housekeeping"],
        images: ["/images/rooms/room-1.jpg"]
      },
      {
        title: "Double Sharing Room",
        description: "Comfortable double sharing room near SG Highway with daily meals.",
        price: 13500,
        occupancy: "Double",
        amenities: ["WiFi", "Meals", "Power Backup", "Security"],
        images: ["/images/rooms/room-2.jpg"]
      },
      {
        title: "Triple Sharing Room",
        description: "Budget-friendly triple sharing room with essential amenities and meals.",
        price: 11000,
        occupancy: "Triple",
        amenities: ["WiFi", "Meals", "Housekeeping", "Security"],
        images: ["/images/rooms/room-3.jpg"]
      }
    ],
    skipDuplicates: true
  });

  await prisma.blog.createMany({
    data: [
      {
        title: "Best PG in Gota Ahmedabad",
        slug: "best-pg-in-gota-ahmedabad",
        excerpt: "Checklist to select a secure and comfortable PG in Gota.",
        content:
          "Finding a quality PG starts with safety, food consistency, commute access, and transparent pricing. Aster Homes is designed for students and professionals with these priorities.",
        featuredImage: "/images/gallery/blog-1.jpg"
      },
      {
        title: "Affordable PG Near SG Highway",
        slug: "affordable-pg-near-sg-highway",
        excerpt: "How to balance budget and comfort when choosing PG near SG Highway.",
        content:
          "Choose a PG with all-inclusive pricing, stable internet, and good transport links. This lowers monthly surprises and improves day-to-day convenience.",
        featuredImage: "/images/gallery/blog-2.jpg"
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
