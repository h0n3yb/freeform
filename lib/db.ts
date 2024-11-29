import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Re-export everything from @prisma/client
export * from '@prisma/client'

// Define PieceStatus enum if not already defined in Prisma schema
export enum PieceStatus {
  GREENWARE = 'GREENWARE',
  BISQUED = 'BISQUED',
  GLAZED = 'GLAZED',
  COMPLETED = 'COMPLETED',
  PICKED_UP = 'PICKED_UP'
} 