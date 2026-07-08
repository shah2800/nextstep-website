import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel (serverless) a local SQLite file is not writable/persistent, so we
// use Turso (libSQL) via a driver adapter. Locally, with no TURSO_DATABASE_URL
// set, we fall back to the SQLite file from DATABASE_URL for dev.
function createPrisma(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL
  if (url) {
    const adapter = new PrismaLibSql({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    return new PrismaClient({ adapter })
  }
  return new PrismaClient()
}

export const db = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
