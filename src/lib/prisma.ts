// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function getPrismaClient(): PrismaClient {
  // Handle Vercel serverless Lambda environment where root is read-only
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db'
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        '/var/task/prisma/dev.db',
        '/var/task/dev.db',
      ]
      let copied = false
      for (const p of candidates) {
        try {
          if (fs.existsSync(p)) {
            fs.copyFileSync(p, tmpDbPath)
            copied = true
            break
          }
        } catch {
          // continue checking next location
        }
      }
      if (!copied) {
        try {
          fs.writeFileSync(tmpDbPath, '')
        } catch {}
      }
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
        },
      },
      log: ['error'],
    })
  }

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  const client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}

export const prisma = getPrismaClient()
