import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

// Create a new connection pool using WebSocket protocol for Edge compatibility
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaNeon(pool);
export const prisma = new PrismaClient({ adapter });
