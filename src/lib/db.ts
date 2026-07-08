import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Turso (libSQL) is used in production (Vercel serverless can't persist a local
// SQLite file). Values fall back to the provisioned NextStep DB so the app works
// even before env vars are set; override via TURSO_DATABASE_URL / TURSO_AUTH_TOKEN.
// NOTE: rotate this token if this repo is ever made public.
const TURSO_URL =
  process.env.TURSO_DATABASE_URL ||
  'libsql://nextstep-shah2800.aws-us-east-1.turso.io'
const TURSO_TOKEN =
  process.env.TURSO_AUTH_TOKEN ||
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODM0NzQ0NzAsImlkIjoiMDE5ZjNmNTctY2QwMS03MWZkLWJjYzctMDY5ZmRkYzFlMTc3Iiwia2lkIjoiY3QzM2JYQ2RiYXBoWTNVVDFJdm5YQjlXUV9LM0pBR2VCbFJzekNVMHdYcyIsInJpZCI6IjgxODVmZmNlLTI0MzYtNDkzZS1iOGYzLTU4MTM2ZGQwMDc2NyJ9.cySeYBLOkF1vHpWHClxtwcdLfoe_vla0ioF4pV__UOn44UFP-ZqMsfEY97hPuy01gzzUCsdBNy0VIOUuPPmSBQ'

function createPrisma(): PrismaClient {
  if (TURSO_URL && TURSO_TOKEN) {
    const adapter = new PrismaLibSql({ url: TURSO_URL, authToken: TURSO_TOKEN })
    return new PrismaClient({ adapter })
  }
  return new PrismaClient()
}

export const db = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
