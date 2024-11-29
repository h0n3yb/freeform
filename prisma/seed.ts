import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.image.deleteMany();
  await prisma.piece.deleteMany();
  await prisma.user.deleteMany();

  // Create instructor
  const instructor = await prisma.user.create({
    data: {
      id: 'instructor1',
      email: 'instructor@studio.com',
      name: 'Jane Smith',
      role: 'INSTRUCTOR',
    },
  });

  // Create students
  const student1 = await prisma.user.create({
    data: {
      id: 'student1@example.com',
      email: 'student1@example.com',
      name: 'Alice Johnson',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      id: 'student2',
      email: 'student2@example.com',
      name: 'Bob Wilson',
      role: 'STUDENT',
    },
  });

  console.log('Seed data created successfully!');
  console.log({
    users: await prisma.user.count(),
    pieces: await prisma.piece.count(),
    images: await prisma.image.count(),
    notifications: await prisma.notification.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 