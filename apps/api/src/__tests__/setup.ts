import { prisma } from '../../utils/prisma.js';

afterAll(async () => {
  await prisma.$disconnect();
});
