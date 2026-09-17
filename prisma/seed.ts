import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ORGANIZER_EMAIL;
  const password = process.env.ORGANIZER_PASSWORD;
  const name = process.env.ORGANIZER_NAME ?? "Club Organizer";

  if (!email || !password) {
    throw new Error(
      "ORGANIZER_EMAIL and ORGANIZER_PASSWORD must be set in .env before seeding."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const organizer = await prisma.organizer.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  console.log(`✅ Organizer seeded: ${organizer.name} <${organizer.email}>`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
