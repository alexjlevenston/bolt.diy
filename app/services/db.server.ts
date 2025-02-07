import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Define the type for the extended PrismaClient
let prisma: ReturnType<typeof getPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof getPrismaClient> | undefined;
}

// Helper function to create PrismaClient instance with Accelerate
function getPrismaClient() {
  return new PrismaClient().$extends(withAccelerate());
}

// This prevents multiple instances of Prisma Client in development
if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaClient();
} else {
  if (!global.__db) {
    global.__db = getPrismaClient();
  }

  prisma = global.__db;
}

export { prisma };
