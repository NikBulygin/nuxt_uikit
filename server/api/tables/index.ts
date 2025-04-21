import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getQuery, readBody } from 'h3'

const prisma = new PrismaClient()

// GET: Read with filtering and pagination
export const GET = defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 20
  const skip = (page - 1) * perPage

  // Build filter conditions
  const where: any = {}
  
  if (query.startDate && query.endDate) {
    where.invoiceDate = {
      gte: new Date(query.startDate as string),
      lte: new Date(query.endDate as string)
    }
  }

  if (query.invoiceNumber) {
    where.invoiceNumber = {
      contains: query.invoiceNumber,
      mode: 'insensitive'
    }
  }

  if (query.gtdNumber) {
    where.gtdNumber = {
      contains: query.gtdNumber,
      mode: 'insensitive'
    }
  }

  // Get total count and data
  const [total, data] = await Promise.all([
    prisma.wagonData.count({ where }),
    prisma.wagonData.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { invoiceDate: 'desc' }
    })
  ])

  return {
    data,
    total,
    page,
    perPage
  }
})

// POST: Create one or many records
export const POST = defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = Array.isArray(body) ? body : [body]

  const created = await prisma.$transaction(
    data.map(item => 
      prisma.wagonData.create({
        data: {
          wagonNumber: item.wagonNumber,
          weight: item.weight,
          tio2: item.tio2,
          h2o: item.h2o,
          recalculation: item.recalculation,
          totalWeight: item.totalWeight,
          invoiceNumber: item.invoiceNumber,
          invoiceDate: new Date(item.invoiceDate),
          gtdNumber: item.gtdNumber,
          gtdDate: new Date(item.gtdDate)
        }
      })
    )
  )

  return { created }
})

// PUT: Update one or many records
export const PUT = defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = Array.isArray(body) ? body : [body]

  const updated = await prisma.$transaction(
    data.map(item => 
      prisma.wagonData.update({
        where: { id: item.id },
        data: {
          wagonNumber: item.wagonNumber,
          weight: item.weight,
          tio2: item.tio2,
          h2o: item.h2o,
          recalculation: item.recalculation,
          totalWeight: item.totalWeight,
          invoiceNumber: item.invoiceNumber,
          invoiceDate: new Date(item.invoiceDate),
          gtdNumber: item.gtdNumber,
          gtdDate: new Date(item.gtdDate)
        }
      })
    )
  )

  return { updated }
})

// DELETE: Delete one or many records
export const DELETE = defineEventHandler(async (event) => {
  const body = await readBody(event)
  const ids = Array.isArray(body) ? body : [body]

  const deleted = await prisma.wagonData.deleteMany({
    where: {
      id: { in: ids }
    }
  })

  return { deleted }
}) 