import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient, WagonData } from '@prisma/client'
import { createServer } from 'http'
import { $fetch } from 'ohmyfetch'

interface WagonDataInput extends Omit<WagonData, 'id' | 'createdAt' | 'updatedAt'> {}

const prisma = new PrismaClient()

describe('Wagon Data API', () => {
  const testData: WagonDataInput = {
    wagonNumber: 'TEST-001',
    weight: 100.5,
    tio2: 95.5,
    h2o: 0.5,
    recalculation: 22.73,
    totalWeight: 100.5,
    invoiceNumber: 'INV-001',
    invoiceDate: new Date('2024-01-01'),
    gtdNumber: 'GTD-001',
    gtdDate: new Date('2024-01-01')
  }

  let createdId: number

  // Clean up before tests
  beforeAll(async () => {
    await prisma.testWagonData.deleteMany()
  })

  // Clean up after tests
  afterAll(async () => {
    await prisma.testWagonData.deleteMany()
    await prisma.$disconnect()
  })

  it('should create a new wagon data record', async () => {
    const response = await $fetch('/api/tables', {
      method: 'POST',
      body: testData
    })

    expect(response.created).toBeDefined()
    expect(response.created[0]).toMatchObject(testData)
    createdId = response.created[0].id
  })

  it('should create multiple wagon data records', async () => {
    const multipleData = [
      { ...testData, wagonNumber: 'TEST-002' },
      { ...testData, wagonNumber: 'TEST-003' }
    ]

    const response = await $fetch('/api/tables', {
      method: 'POST',
      body: multipleData
    })

    expect(response.created).toHaveLength(2)
    expect(response.created[0].wagonNumber).toBe('TEST-002')
    expect(response.created[1].wagonNumber).toBe('TEST-003')
  })

  it('should get wagon data with pagination and filters', async () => {
    const response = await $fetch('/api/tables', {
      query: {
        page: 1,
        perPage: 10,
        invoiceNumber: 'INV-001'
      }
    })

    expect(response.data).toBeDefined()
    expect(response.total).toBeGreaterThan(0)
    expect(response.data[0]).toMatchObject(testData)
  })

  it('should update wagon data', async () => {
    const updateData = {
      ...testData,
      id: createdId,
      weight: 120.5
    }

    const response = await $fetch('/api/tables', {
      method: 'PUT',
      body: updateData
    })

    expect(response.updated[0].weight).toBe(120.5)
  })

  it('should update multiple wagon data records', async () => {
    const multipleUpdateData = [
      { ...testData, id: createdId, weight: 130.5 },
      { ...testData, id: createdId + 1, weight: 140.5 }
    ]

    const response = await $fetch('/api/tables', {
      method: 'PUT',
      body: multipleUpdateData
    })

    expect(response.updated).toHaveLength(2)
    expect(response.updated[0].weight).toBe(130.5)
    expect(response.updated[1].weight).toBe(140.5)
  })

  it('should delete wagon data', async () => {
    const response = await $fetch('/api/tables', {
      method: 'DELETE',
      body: createdId
    })

    expect(response.deleted.count).toBeGreaterThan(0)

    // Verify deletion
    const getResponse = await $fetch('/api/tables', {
      query: {
        page: 1,
        perPage: 10,
        invoiceNumber: 'INV-001'
      }
    })

    expect(getResponse.data.find(item => item.id === createdId)).toBeUndefined()
  })

  it('should delete multiple wagon data records', async () => {
    const response = await $fetch('/api/tables', {
      method: 'DELETE',
      body: [createdId + 1, createdId + 2]
    })

    expect(response.deleted.count).toBe(2)
  })
}) 